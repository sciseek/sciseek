from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.models import SavedQuestion
from app.schemas import AskRequest, AskResponse
from app.services.openai_client import generate_sciseek_answer
from app.db import SessionLocal

from fastapi import Request
import hashlib
from datetime import date

from app.models import DailyUsage, WaitlistSignup
from app.schemas import UsageInfo

FREE_DAILY_LIMIT = 5
PAYWALL_SALT = "change-this-in-env"

app = FastAPI(title="SciSeek API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sciseek-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_or_create_usage(db, identifier):
    today = date.today()

    usage = (
        db.query(DailyUsage)
        .filter(DailyUsage.identifier == identifier, DailyUsage.usage_date == today)
        .first()
    )

    if not usage:
        usage = DailyUsage(
            identifier=identifier,
            usage_date=today,
            question_count=0,
        )
        db.add(usage)
        db.commit()
        db.refresh(usage)

    return usage

identifier = make_identifier(request)
usage = get_or_create_usage(db, identifier)

if usage.question_count >= FREE_DAILY_LIMIT:
    return AskResponse(
        status="paywalled",
        message="You’ve reached today’s free question limit.",
        usage=UsageInfo(
            question_count=usage.question_count,
            daily_limit=FREE_DAILY_LIMIT,
            remaining=0,
            paywall_hit=True,
        ),
        is_science=True,
        related_questions=[],
    )

@app.get("/")
def read_root():
    return {"status": "ok", "message": "SciSeek API is running"}


@app.post("/api/ask", response_model=AskResponse)
def ask_question(payload: AskRequest, request: Request):
    question = payload.question.strip()
    tier = payload.tier
    mode = payload.mode

    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    db = SessionLocal()

    try:
        result = generate_sciseek_answer(
            question=question,
            tier=tier,
            mode=mode,
            usage.question_count += 1
            db.commit()
        )

        answer_data = result["answer"]

        saved = SavedQuestion(
            question=question,
            tier=tier,
            mode=mode,
            answer_json=answer_data,
        )

        db.add(saved)
        db.commit()

        return AskResponse(
            **answer_data,
            status="ok",
            usage=UsageInfo(
                question_count=usage.question_count,
                daily_limit=FREE_DAILY_LIMIT,
                remaining=max(0, FREE_DAILY_LIMIT - usage.question_count),
                paywall_hit=False,
            ),
        )

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
