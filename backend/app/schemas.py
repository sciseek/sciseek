from pydantic import BaseModel
from typing import List, Literal, Dict, Any


class UsageInfo(BaseModel):
    question_count: int
    daily_limit: int
    remaining: int
    paywall_hit: bool


class AskRequest(BaseModel):
    question: str
    tier: Literal["free", "paid"] = "free"
    mode: Literal["simple", "standard", "deep"] = "standard"


class AnswerSection(BaseModel):
    title: str
    body: str


class Citation(BaseModel):
    title: str
    url: str
    source: str


class VisualBlock(BaseModel):
    type: str
    data: Dict[str, Any]


class AskResponse(BaseModel):
    is_science: bool
    refusal_message: str | None = None

    hook: str | None = None
    short_summary: str | None = None
    sections: List[AnswerSection] | None = None
    key_points: List[str] | None = None
    related_questions: List[str]
    citations: List[Citation] | None = None
    visual: VisualBlock | None = None

    status: str = "ok"
    usage: UsageInfo | None = None
    message: str | None = None
