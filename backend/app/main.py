from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.models import SavedQuestion
from app.schemas import AskRequest, AskResponse
from app.services.openai_client import generate_sciseek_answer
from app.db import SessionLocal

app = FastAPI(title="SciSeek API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sciseek-app.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "SciSeek API is running"}


@app.post("/api/ask", response_model=AskResponse)
def ask_question(payload: AskRequest):
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

        return AskResponse(**answer_data)

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
