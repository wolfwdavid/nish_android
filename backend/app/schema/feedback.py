from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.feedback import (
    FeedbackType,
    FeedbackStatus,
    FeedbackSentiment,
)


class FeedbackCreate(BaseModel):
    feedback_type: FeedbackType = FeedbackType.general

    rating: Optional[int] = Field(
        default=None,
        ge=1,
        le=5,
    )

    title: str = Field(
        ...,
        min_length=2,
        max_length=140,
    )

    message: str = Field(
        ...,
        min_length=5,
        max_length=5000,
    )

    page_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    source: str = Field(
        default="feedback_page",
        max_length=80,
    )

    allow_contact: bool = False

    contact_email: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    diagnostics: Optional[dict[str, Any]] = None

    @field_validator("title", "message", "page_url", "source", "contact_email")
    @classmethod
    def strip_strings(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        stripped = value.strip()

        if stripped == "":
            return None

        return stripped


class FeedbackResponse(BaseModel):
    id: UUID

    user_id: Optional[UUID]

    feedback_type: FeedbackType

    status: FeedbackStatus

    sentiment: FeedbackSentiment

    rating: Optional[int]

    title: str

    message: str

    page_url: Optional[str]

    source: str

    allow_contact: bool

    contact_email: Optional[str]

    created_at: datetime

    updated_at: datetime

    reviewed_at: Optional[datetime]

    model_config = ConfigDict(
        from_attributes=True,
    )


class FeedbackAdminUpdate(BaseModel):
    status: Optional[FeedbackStatus] = None

    sentiment: Optional[FeedbackSentiment] = None

    admin_notes: Optional[str] = Field(
        default=None,
        max_length=5000,
    )


class FeedbackAdminResponse(FeedbackResponse):
    diagnostics: Optional[dict[str, Any]]

    admin_notes: Optional[str]

    reviewed_by_user_id: Optional[UUID]