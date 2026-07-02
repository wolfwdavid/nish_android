import enum
import uuid

from sqlalchemy import (
    Column,
    String,
    Text,
    ForeignKey,
    DateTime,
    Boolean,
    Integer,
    Enum as SQLEnum,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class FeedbackType(str, enum.Enum):
    general = "general"
    bug = "bug"
    idea = "idea"
    ux = "ux"
    praise = "praise"
    complaint = "complaint"


class FeedbackStatus(str, enum.Enum):
    new = "new"
    reviewed = "reviewed"
    planned = "planned"
    shipped = "shipped"
    archived = "archived"


class FeedbackSentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    feedback_type = Column(
        SQLEnum(FeedbackType, name="feedback_type"),
        nullable=False,
        default=FeedbackType.general,
        index=True,
    )

    status = Column(
        SQLEnum(FeedbackStatus, name="feedback_status"),
        nullable=False,
        default=FeedbackStatus.new,
        index=True,
    )

    sentiment = Column(
        SQLEnum(FeedbackSentiment, name="feedback_sentiment"),
        nullable=False,
        default=FeedbackSentiment.neutral,
        index=True,
    )

    rating = Column(
        Integer,
        nullable=True,
    )

    title = Column(
        String(140),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    page_url = Column(
        String(500),
        nullable=True,
    )

    source = Column(
        String(80),
        nullable=False,
        default="feedback_page",
    )

    allow_contact = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    contact_email = Column(
        String(255),
        nullable=True,
    )

    diagnostics = Column(
        JSONB,
        nullable=True,
    )

    admin_notes = Column(
        Text,
        nullable=True,
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    reviewed_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="feedback_items",
    )

    reviewed_by = relationship(
        "User",
        foreign_keys=[reviewed_by_user_id],
    )