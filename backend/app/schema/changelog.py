from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID
from typing import Literal


ChangelogType = Literal[
    "release",
    "feature",
    "fix",
    "improvement",
    "security",
    "breaking",
    "announcement",
]


class CreateChangelog(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=160,
    )

    slug: str | None = Field(
        default=None,
        max_length=180,
    )

    version: str | None = Field(
        default=None,
        max_length=50,
    )

    summary: str | None = None

    content: str = Field(
        min_length=10,
    )

    changelog_type: ChangelogType = "release"

    tags: list[str] = Field(
        default_factory=list,
    )

    is_published: bool = False


class UpdateChangelog(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=160,
    )

    slug: str | None = Field(
        default=None,
        max_length=180,
    )

    version: str | None = Field(
        default=None,
        max_length=50,
    )

    summary: str | None = None

    content: str | None = Field(
        default=None,
        min_length=10,
    )

    changelog_type: ChangelogType | None = None

    tags: list[str] | None = None

    is_published: bool | None = None


class GetChangelog(BaseModel):
    id: UUID

    title: str

    slug: str

    version: str | None

    summary: str | None

    content: str

    changelog_type: str

    tags: list[str]

    is_published: bool

    published_at: datetime | None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ChangelogListResponse(BaseModel):
    items: list[GetChangelog]

    total: int

    limit: int

    offset: int