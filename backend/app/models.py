from sqlalchemy import Column, Date, DateTime, Integer, String, JSON, UniqueConstraint, func

from app.db import Base


class SavedQuestion(Base):
    __tablename__ = "saved_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    tier = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    answer_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class DailyUsage(Base):
    __tablename__ = "daily_usage"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, nullable=False, index=True)
    usage_date = Column(Date, nullable=False, index=True)
    question_count = Column(Integer, nullable=False, default=0)
    email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("identifier", "usage_date", name="uq_daily_usage_identifier_date"),
    )


class WaitlistSignup(Base):
    __tablename__ = "waitlist_signups"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    source = Column(String, nullable=True)
    identifier = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
