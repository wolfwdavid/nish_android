from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.feedback import (
    FeedbackStatus,
    FeedbackType,
    FeedbackSentiment,
)

from app.models.support import (
    TicketCategory,
    TicketPriority,
    TicketStatus,
)


# =========================================================
# ADMIN DASHBOARD
# =========================================================

class AdminDashboardStats(BaseModel):
    total_users: int
    total_projects: int
    total_live_projects: int
    new_feedback: int
    open_support_tickets: int
    active_users: int


class AdminRecentUser(BaseModel):
    id: UUID
    clerk_user_id: str
    username: str
    display_name: str
    email: str | None = None
    is_active: bool
    is_banned: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminRecentProject(BaseModel):
    id: UUID
    title: str
    slug: str
    stars_count: int
    views_count: int
    is_featured: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminDashboardResponse(BaseModel):
    stats: AdminDashboardStats
    recent_users: list[AdminRecentUser]
    recent_projects: list[AdminRecentProject]


# =========================================================
# ADMIN FEEDBACK
# =========================================================

class AdminFeedbackItem(BaseModel):
    id: UUID
    user_id: UUID | None = None

    feedback_type: FeedbackType
    status: FeedbackStatus
    sentiment: FeedbackSentiment | None = None

    rating: int | None = None
    title: str | None = None
    message: str
    page_url: str | None = None
    contact_email: str | None = None

    admin_notes: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateFeedback(BaseModel):
    status: FeedbackStatus | None = None
    sentiment: FeedbackSentiment | None = None
    admin_notes: str | None = None


# =========================================================
# ADMIN SUPPORT
# =========================================================

class AdminSupportTicketItem(BaseModel):
    id: UUID
    ticket_number: str

    user_id: UUID | None = None
    project_id: UUID | None = None

    category: TicketCategory
    status: TicketStatus
    priority: TicketPriority

    subject: str
    description: str

    internal_notes: str | None = None
    resolved_at: datetime | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateSupportTicket(BaseModel):
    status: TicketStatus | None = None
    priority: TicketPriority | None = None
    internal_notes: str | None = None


# =========================================================
# ADMIN USERS
# =========================================================

class AdminUserItem(BaseModel):
    id: UUID
    clerk_user_id: str

    username: str
    display_name: str | None = None
    email: str | None = None

    project_count: int
    reports_count: int

    is_verified: bool
    is_active: bool
    is_private: bool
    is_banned: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateUser(BaseModel):
    is_verified: bool | None = None
    is_active: bool | None = None
    is_banned: bool | None = None


# =========================================================
# ADMIN PROJECTS
# =========================================================

class AdminProjectItem(BaseModel):
    id: UUID
    user_id: UUID

    title: str
    slug: str
    description: str

    github_url: str
    live_url: str | None = None
    thumbnail_url: str | None = None

    stars_count: int
    views_count: int
    comments_count: int

    is_featured: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateProject(BaseModel):
    is_featured: bool | None = None


AdminChangelogType = Literal[
    "release",
    "feature",
    "fix",
    "improvement",
    "security",
    "breaking",
    "announcement",
]


class AdminCreateChangelog(BaseModel):
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

    changelog_type: AdminChangelogType = "release"

    tags: list[str] = Field(
        default_factory=list,
    )

    is_published: bool = False


class AdminUpdateChangelog(BaseModel):
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

    changelog_type: AdminChangelogType | None = None

    tags: list[str] | None = None

    is_published: bool | None = None


class AdminChangelogItem(BaseModel):
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


AppNoticeType = Literal[
    "info",
    "success",
    "warning",
    "danger",
    "maintenance",
    "update",
]


class AdminCreateAppNotice(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=160,
    )

    message: str = Field(
        min_length=5,
    )

    notice_type: AppNoticeType = "info"

    cta_label: str | None = Field(
        default=None,
        max_length=80,
    )

    cta_href: str | None = None

    is_active: bool = True

    show_once: bool = True

    priority: int = 0

    starts_at: datetime | None = None

    expires_at: datetime | None = None


class AdminUpdateAppNotice(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=160,
    )

    message: str | None = Field(
        default=None,
        min_length=5,
    )

    notice_type: AppNoticeType | None = None

    cta_label: str | None = Field(
        default=None,
        max_length=80,
    )

    cta_href: str | None = None

    is_active: bool | None = None

    show_once: bool | None = None

    priority: int | None = None

    starts_at: datetime | None = None

    expires_at: datetime | None = None


class AdminAppNoticeItem(BaseModel):
    id: UUID

    title: str

    message: str

    notice_type: str

    cta_label: str | None

    cta_href: str | None

    is_active: bool

    show_once: bool

    priority: int

    starts_at: datetime | None

    expires_at: datetime | None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )