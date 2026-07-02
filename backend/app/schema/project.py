from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# PROJECT
# =========================================================

class CreateProject(BaseModel):

    title: str
    slug: str
    description: str
    github_url: str
    live_url: str | None = None
    thumbnail_url: str | None = None
    demo_video_url: str | None = None
    gallery_urls: list[str] = Field(default_factory=list)
    tech_stack: list[str] = Field(default_factory=list)

class UpdateProject(BaseModel):

    title: str | None = None
    slug: str | None = None
    description: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    thumbnail_url: str | None = None
    demo_video_url: str | None = None
    gallery_urls: list[str] | None = None
    tech_stack: list[str] | None = None
    is_featured: bool | None = None
    stars_count: int | None = None


class GetProject(BaseModel):

    id: UUID
    user_id: UUID

    title: str
    slug: str
    description: str

    github_url: str
    live_url: str | None = None

    thumbnail_url: str | None = None
    demo_video_url: str | None = None

    gallery_urls: list[str] = []

    tech_stack: list[str] = []

    stars_count: int
    views_count: int
    comments_count: int

    is_featured: bool = False

    is_starred: bool = False
    is_bookmarked: bool = False
    

    user : ProjectAuthor

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

class AnalyzeRepoRequest(BaseModel):

    github_url: str


class ProjectAuthor(BaseModel):

    username: str

    avatar_url: str | None = None

    location: str | None = None

    model_config = {
        "from_attributes": True
    }


# =========================================================
# PROJECT STAR
# =========================================================

class GetProjectStar(BaseModel):

    id: UUID
    user_id: UUID
    project_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



# =========================================================
# COMMENT — INPUT
# =========================================================

class AddComment(BaseModel):
    content: str = Field(min_length=1, max_length=2000)
    parent_id: UUID | None = None   # set => this is a reply


class UpdateComment(BaseModel):
    content: str = Field(min_length=1, max_length=2000)




class PaginatedProjects(BaseModel):

    items: list[GetProject]

    next_cursor: datetime | None

    has_more: bool

# =========================================================
# COMMENT — OUTPUT
# =========================================================

class CommentOut(BaseModel):
    id: UUID
    user_id: UUID
    project_id: UUID
    parent_id: UUID | None = None
    content: str
    upvotes_count: int
    downvotes_count: int
    score: int                      # @property on the model
    is_edited: bool
    created_at: datetime
    updated_at: datetime
    user: CommentUser

    model_config = ConfigDict(from_attributes=True)


class GetComment(CommentOut):
    # Two-level threading: top-level comments contain replies,
    # replies themselves do not nest further.
    replies: list[CommentOut] = Field(default_factory=list)


# =========================================================
# PROJECT COMMENT VOTE
# =========================================================

class AddVote(BaseModel):

    vote_type: str                  # "up" or "down"


class GetVote(BaseModel):

    id: UUID
    user_id: UUID
    comment_id: UUID
    vote_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommentUser(BaseModel):

    id: UUID

    username: str

    display_name: str

    avatar_url: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )



# =========================================================
# PROJECT BOOKMARK
# =========================================================

class ProjectBookmarkUser(BaseModel):

    id: UUID

    username: str

    avatar_url: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )



class ProjectBookmarkProject(BaseModel):

    id: UUID

    title: str

    slug: str

    thumbnail_url: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )



class GetProjectBookmark(BaseModel):

    id: UUID

    user_id: UUID

    project_id: UUID

    created_at: datetime

    user: ProjectBookmarkUser

    project: ProjectBookmarkProject

    model_config = ConfigDict(
        from_attributes=True
    )


class ProjectBookmarkStatus(BaseModel):

    project_id: UUID

    is_bookmarked: bool