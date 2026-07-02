import enum
from datetime import datetime

from sqlalchemy import (
    Enum as SQLEnum,
    Integer,
    String,
    Text,
    DateTime,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class IdeaStatus(str, enum.Enum):
    open = "open"
    under_review = "under_review"
    planned = "planned"
    shipped = "shipped"
    declined = "declined"


class IdeaCategory(str, enum.Enum):
    feature = "feature"
    integration = "integration"
    improvement = "improvement"
    other = "other"


class Idea(Base):
    __tablename__ = "ideas"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    title: Mapped[str] = mapped_column(
        String(140),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    category: Mapped[IdeaCategory | None] = mapped_column(
        SQLEnum(IdeaCategory, name="idea_category"),
        nullable=True,
    )

    status: Mapped[IdeaStatus] = mapped_column(
        SQLEnum(IdeaStatus, name="idea_status"),
        default=IdeaStatus.open,
        nullable=False,
    )

    upvotes: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    clerk_user_id: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
        index=True,
    )

    contact_email: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    page_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    diagnostics: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )