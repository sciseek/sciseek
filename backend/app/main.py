import hashlib
import os
from datetime import date

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, SessionLocal, engine
from pydantic import BaseModel
from typing import Any

from app.models import AnalyticsEvent, DailyUsage, SavedQuestion, WaitlistSignup
from app.schemas import AskRequest, AskResponse, UsageInfo, WaitlistRequest, WaitlistResponse
from app.services.openai_client import generate_sciseek_answer

FREE_DAILY_LIMIT = int(os.getenv("FREE_DAILY_LIMIT", "5"))
PAYWALL_SALT = os.getenv("PAYWALL_SALT", "change-this-in-production")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "dev-admin-token")

app = FastAPI(title="SciSeek API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sciseek-app.vercel.app",
        "https://www.sciseek-app.vercel.app",
        "https://www.sciseek.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyticsEventRequest(BaseModel):
    event_name: str
    session_id: str | None = None
    properties: dict[str, Any] | None = None



def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def make_identifier(request: Request) -> str:
    ip = get_client_ip(request)
    user_agent = request.headers.get("user-agent", "unknown")
    raw = f"{ip}|{user_agent}|{PAYWALL_SALT}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def get_or_create_usage(db, identifier: str) -> DailyUsage:
    today = date.today()
    usage = (
        db.query(DailyUsage)
        .filter(DailyUsage.identifier == identifier, DailyUsage.usage_date == today)
        .first()
    )

    if usage is None:
        usage = DailyUsage(identifier=identifier, usage_date=today, question_count=0)
        db.add(usage)
        db.commit()
        db.refresh(usage)

    return usage


def build_usage_info(question_count: int, paywall_hit: bool) -> UsageInfo:
    return UsageInfo(
        question_count=question_count,
        daily_limit=FREE_DAILY_LIMIT,
        remaining=max(0, FREE_DAILY_LIMIT - question_count),
        paywall_hit=paywall_hit,
    )


def safe_track_event(
    db,
    event_name: str,
    identifier: str | None = None,
    session_id: str | None = None,
    properties: dict[str, Any] | None = None,
) -> None:
    try:
        event = AnalyticsEvent(
            event_name=event_name,
            identifier=identifier,
            session_id=session_id,
            properties=properties or {},
        )
        db.add(event)
        db.commit()
    except Exception as exc:
        db.rollback()
        print("Analytics tracking error:", exc)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "SciSeek API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/ask", response_model=AskResponse)
def ask_question(payload: AskRequest, request: Request):
    question = payload.question.strip()
    tier = payload.tier
    mode = payload.mode

    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    db = SessionLocal()

    try:
        identifier = make_identifier(request)
        session_id = request.headers.get("x-session-id")
        usage = get_or_create_usage(db, identifier)

        safe_track_event(
            db,
            event_name="ask_submitted",
            identifier=identifier,
            session_id=session_id,
            properties={
                "tier": tier,
                "mode": mode,
                "question_length": len(question),
            },
        )

        if usage.question_count >= FREE_DAILY_LIMIT:
            safe_track_event(
                db,
                event_name="paywall_hit",
                identifier=identifier,
                session_id=session_id,
                properties={
                    "tier": tier,
                    "mode": mode,
                    "question_count": usage.question_count,
                    "daily_limit": FREE_DAILY_LIMIT,
                },
            )

            return AskResponse(
                is_science=True,
                related_questions=[],
                status="paywalled",
                message="You’ve reached today’s free question limit.",
                usage=build_usage_info(usage.question_count, paywall_hit=True),
            )

        result = generate_sciseek_answer(
            question=question,
            tier=tier,
            mode=mode,
        )

        answer_data = result["answer"]

        saved = SavedQuestion(
            question=question,
            tier=tier,
            mode=mode,
            answer_json=answer_data,
        )

        db.add(saved)
        usage.question_count += 1
        db.commit()
        db.refresh(usage)

        safe_track_event(
            db,
            event_name="ask_succeeded",
            identifier=identifier,
            session_id=session_id,
            properties={
                "tier": tier,
                "mode": mode,
                "question_count": usage.question_count,
            },
        )

        return AskResponse(
            **answer_data,
            status="ok",
            usage=build_usage_info(usage.question_count, paywall_hit=False),
            message=None,
        )

    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        print("OpenAI or DB error:", exc)
        raise HTTPException(status_code=500, detail="Failed to generate answer.")
    finally:
        db.close()


@app.get("/api/history")
def get_history():
    db = SessionLocal()

    try:
        items = (
            db.query(SavedQuestion)
            .order_by(SavedQuestion.created_at.desc())
            .limit(20)
            .all()
        )

        return [
            {
                "id": item.id,
                "question": item.question,
                "tier": item.tier,
                "mode": item.mode,
                "created_at": item.created_at.isoformat(),
                "answer": item.answer_json,
            }
            for item in items
        ]
    finally:
        db.close()


@app.post("/api/waitlist", response_model=WaitlistResponse)
def join_waitlist(payload: WaitlistRequest, request: Request):
    email = payload.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    db = SessionLocal()
    identifier = make_identifier(request)
    session_id = request.headers.get("x-session-id")

    try:
        existing = db.query(WaitlistSignup).filter(WaitlistSignup.email == email).first()

        if existing is None:
            signup = WaitlistSignup(
                email=email,
                source=payload.source,
                identifier=identifier,
            )
            db.add(signup)

        usage = get_or_create_usage(db, identifier)
        usage.email = email

        db.commit()

        safe_track_event(
            db,
            event_name="waitlist_joined",
            identifier=identifier,
            session_id=session_id,
            properties={
                "source": payload.source,
            },
        )

        return WaitlistResponse(success=True, message="Thanks — you’re on the waitlist.")
    except Exception as exc:
        db.rollback()
        print("Waitlist error:", exc)
        raise HTTPException(status_code=500, detail="Failed to join waitlist.")
    finally:
        db.close()


@app.post("/api/analytics")
def create_analytics_event(payload: AnalyticsEventRequest, request: Request):
    db = SessionLocal()
    identifier = make_identifier(request)

    try:
        safe_track_event(
            db,
            event_name=payload.event_name,
            identifier=identifier,
            session_id=payload.session_id or request.headers.get("x-session-id"),
            properties=payload.properties or {},
        )
        return {"success": True}
    finally:
        db.close()

def verify_admin(request: Request):
    token = request.headers.get("x-admin-token")
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/api/admin/metrics")
def get_admin_metrics(request: Request):
    verify_admin(request)
    db = SessionLocal()

    try:
        total_questions = db.query(AnalyticsEvent).filter_by(event_name="ask_submitted").count()
        successful_answers = db.query(AnalyticsEvent).filter_by(event_name="ask_succeeded").count()
        paywall_hits = db.query(AnalyticsEvent).filter_by(event_name="paywall_hit").count()
        waitlist = db.query(AnalyticsEvent).filter_by(event_name="waitlist_joined").count()

        conversion_rate = (waitlist / paywall_hits) if paywall_hits else 0

        return {
            "total_questions": total_questions,
            "successful_answers": successful_answers,
            "paywall_hits": paywall_hits,
            "waitlist_signups": waitlist,
            "conversion_rate": round(conversion_rate, 3),
        }
    finally:
        db.close()

from datetime import datetime, timedelta
from sqlalchemy import func

@app.get("/api/admin/report")
def get_admin_report(request: Request):
    verify_admin(request)
    db = SessionLocal()

    try:
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        daily = (
            db.query(
                func.date(AnalyticsEvent.created_at).label("day"),
                AnalyticsEvent.event_name.label("event_name"),
                func.count().label("count"),
            )
            .filter(AnalyticsEvent.created_at >= seven_days_ago)
            .group_by(func.date(AnalyticsEvent.created_at), AnalyticsEvent.event_name)
            .order_by(func.date(AnalyticsEvent.created_at))
            .all()
        )

        top_features = (
            db.query(
                AnalyticsEvent.properties["feature"].astext.label("feature"),
                func.count().label("count"),
            )
            .filter(AnalyticsEvent.event_name == "pro_feature_clicked")
            .group_by(AnalyticsEvent.properties["feature"].astext)
            .order_by(func.count().desc())
            .all()
        )

        return {
            "daily_activity": [
                {
                    "day": str(row.day),
                    "event": row.event_name,
                    "count": row.count,
                }
                for row in daily
            ],
            "top_features": [
                {
                    "feature": row.feature or "unknown",
                    "count": row.count,
                }
                for row in top_features
            ],
        }
    finally:
        db.close()