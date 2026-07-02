from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.idea import IdeaCategory, IdeaStatus


class IdeaCreate(BaseModel):
    title: str = Field(min_length=2, max_length=140)
    description: str = Field(min_length=10, max_length=5000)
    category: Optional[IdeaCategory] = None
    contact_email: Optional[str] = None
    page_url: Optional[str] = None
    diagnostics: dict[str, Any] = Field(default_factory=dict)


class IdeaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    category: Optional[IdeaCategory]
    status: IdeaStatus
    upvotes: int
    created_at: datetime