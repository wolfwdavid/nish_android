from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from pydantic import EmailStr

from app.schema.ProfileAnalytics import ProfileLiveProjectResponse, ProfileProjectResponse, UserStackStatResponse


class UserSync(BaseModel):

    clerk_user_id: str
    email: EmailStr
    display_name: str | None = None
    avatar_url: str | None = None


class UserOnboarding(BaseModel):

    clerk_user_id: str
    username: str
    display_name: str

    bio: str | None = None

    avatar_url: str | None = None
    banner_url: str | None = None

    github_url: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None
    instagram_url: str | None = None

    location: str | None = None
    current_build: str | None = None


class UserResponse(BaseModel):

    clerk_user_id: str
    username: str
    display_name: str | None
    email: str

    bio: str | None

    avatar_url: str | None
    banner_url: str | None

    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None
    instagram_url: str | None

    location: str | None
    current_build: str | None

    reputation_score: int
    followers_count: int
    following_count: int
    posts_count: int
    project_count: int
    onboarding_completed: bool

    class Config:
        from_attributes = True


class UserFullProfileResponse(BaseModel):
    id: UUID
    clerk_user_id: str

    username: str
    display_name: str | None
    email: str

    bio: str | None
    avatar_url: str | None
    banner_url: str | None

    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None
    instagram_url: str | None

    location: str | None
    current_build: str | None

    reputation_score: int
    followers_count: int
    following_count: int
    posts_count: int
    project_count: int

    joined_date: datetime

    projects: list[ProfileProjectResponse]
    live_projects: list[ProfileLiveProjectResponse]
    stack_stats: list[UserStackStatResponse]

    model_config = ConfigDict(from_attributes=True)