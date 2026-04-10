from sqlalchemy import Column, DateTime, Integer, String, JSON, func

from app.db import Base


class SavedQuestion(Base):
    __tablename__ = "saved_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    tier = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    answer_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)