from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserStackStatResponse(BaseModel):
    id: UUID
    stack_name: str
    projects_count: int
    live_projects_count: int
    journal_entries_count: int
    score: int
    level: int
    last_used_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class ProfileProjectResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    description: str | None
    github_url: str | None
    live_url: str | None
    thumbnail_url: str | None
    tech_stack: list[str]
    stars_count: int
    views_count: int
    comments_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileLiveProjectResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    goal: str
    progress_percentage: int
    status: str
    tech_stack: list[str]
    journal_count: int
    views_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserFullProfileResponse(BaseModel):
    id: UUID
    username: str
    clerk_user_id: str
    display_name: str | None
    email: str
    bio: str | None
    avatar_url: str | None
    banner_url: str | None
    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None
    location: str | None
    current_build: str | None

    reputation_score: int
    followers_count: int
    following_count: int
    posts_count: int
    project_count: int

    projects: list[ProfileProjectResponse]
    live_projects: list[ProfileLiveProjectResponse]
    stack_stats: list[UserStackStatResponse]

    model_config = ConfigDict(from_attributes=True)