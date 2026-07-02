from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from app.schema.profile import PublicUser


# =========================================================
# LIVE PROJECTS
# =========================================================

class CreateLiveProject(BaseModel):

    title: str
    slug: str

    goal: str

    description: str | None = None

    current_status: str | None = None
    current_goal: str | None = None

    progress_percentage: int = 0

    category: str | None = None

    github_url: str | None = None
    live_url: str | None = None

    demo_video_url: str | None = None
    thumbnail_url: str | None = None

    gallery_urls: list[str] = Field(default_factory=list)

    tech_stack: list[str] = Field(default_factory=list)

    is_public: bool = True
    is_draft: bool = False

class UpdateLiveProject(BaseModel):

    title: str | None = None
    slug: str | None = None

    goal: str | None = None

    description: str | None = None

    current_status: str | None = None
    current_goal: str | None = None

    progress_percentage: int | None = None

    status: str | None = None

    category: str | None = None

    github_url: str | None = None
    live_url: str | None = None

    demo_video_url: str | None = None
    thumbnail_url: str | None = None

    gallery_urls: list[str] | None = None

    tech_stack: list[str] | None = None

    is_public: bool | None = None
    is_featured: bool | None = None


class GetLiveProject(BaseModel):

    id: UUID

    user_id: UUID

    user: PublicUser

    title: str

    slug: str

    goal: str

    description: str | None = None

    github_url: str | None = None

    live_url: str | None = None

    demo_video_url: str | None = None

    thumbnail_url: str | None = None

    gallery_urls: list[str] = []

    tech_stack: list[str] = []

    progress_percentage: int = 0

    current_status: str | None = None

    current_goal: str | None = None

    status: str = "active"

    category: str | None = None

    is_public: bool = True

    is_featured: bool = False

    views_count: int = 0

    journal_count: int = 0

    days_count: int = 0

    completed_at: datetime | None = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# LIVE PROJECT JOURNALS
# =========================================================

class ProblemSolution(BaseModel):

    problem: str
    solution: str


class CreateLiveProjectJournal(BaseModel):

    day_number: int

    content: str

    entry_type: str = "progress"

    media_urls: list[str] = Field(default_factory=list)

    code_snippets: list[str] = Field(default_factory=list)

    problem_solutions: list[ProblemSolution] = Field(default_factory=list)

    progress_percentage: int | None = None


class UpdateLiveProjectJournal(BaseModel):

    content: str | None = None

    entry_type: str | None = None

    media_urls: list[str] | None = None

    code_snippets: list[str] | None = None

    problem_solutions: list[ProblemSolution] | None = None

    progress_percentage: int | None = None


class GetLiveProjectJournal(BaseModel):

    id: UUID

    live_project_id: UUID
    user_id: UUID

    day_number: int

    content: str

    entry_type: str

    media_urls: list[str]

    code_snippets: list[str]

    problem_solutions: list[ProblemSolution]

    progress_percentage: int | None

    likes_count: int
    comments_count: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================================================
# LIVE PROJECT JOURNAL COMMENTS
# =========================================================

class CreateLiveProjectJournalComment(BaseModel):

    content: str

    parent_id: UUID | None = None


class UpdateLiveProjectJournalComment(BaseModel):

    content: str


class GetLiveProjectJournalComment(BaseModel):

    id: UUID

    user_id: UUID
    journal_id: UUID

    parent_id: UUID | None

    content: str

    likes_count: int

    is_edited: bool

    deleted_at: datetime | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================================================
# LIVE PROJECT JOURNAL LIKES
# =========================================================

class GetLiveProjectJournalLike(BaseModel):

    id: UUID

    user_id: UUID
    journal_id: UUID

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



# =========================================================
# FEED LIVE PROJECT
# =========================================================

class FeedLiveProject(BaseModel):
    id: UUID
    title: str
    slug: str

    description: str | None = None
    current_status: str | None = None
    progress_percentage: int | None = None
    status: str | None = None
    tech_stack: list[str] = Field(default_factory=list)
    thumbnail_url: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )

# =========================================================
# FEED EVENTS
# =========================================================

class CreateFeedEvent(BaseModel):

    event_type: str

    content: str | None = None

    live_project_id: UUID | None = None

    event_metadata: dict = Field(
        default_factory=dict
    )

    is_public: bool = True


class GetFeedEvent(BaseModel):

    id: UUID

    user_id: UUID

    user: PublicUser

    live_project_id: UUID | None

    live_project: FeedLiveProject | None = None

    event_type: str

    content: str | None

    event_metadata: dict

    likes_count: int

    comments_count: int

    is_public: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )