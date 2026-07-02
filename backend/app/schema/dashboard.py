from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class DashboardStat(BaseModel):
    total_projects: int
    total_live_projects: int
    total_views: int
    total_stars: int
    total_comments: int
    total_journals: int


class DashboardProject(BaseModel):
    id: UUID
    title: str
    slug: str
    views_count: int
    stars_count: int
    comments_count: int
    tech_stack: list[str] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardLiveProject(BaseModel):
    id: UUID
    title: str
    slug: str
    goal: str
    current_goal: str | None = None
    progress_percentage: int
    status: str
    views_count: int
    journal_count: int
    tech_stack: list[str] = []
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class DashboardStackStat(BaseModel):
    stack_name: str
    projects_count: int = 0
    live_projects_count: int = 0
    score: int = 0

    model_config = ConfigDict(from_attributes=True)


class DashboardFeedEvent(BaseModel):
    id: UUID
    event_type: str
    content: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardResponse(BaseModel):
    username: str
    display_name: str | None = None
    avatar_url: str | None = None

    stats: DashboardStat

    recent_projects: list[DashboardProject]
    active_live_projects: list[DashboardLiveProject]
    top_stacks: list[DashboardStackStat]
    recent_activity: list[DashboardFeedEvent]