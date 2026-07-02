import uuid

from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
    Index,
)

from sqlalchemy.dialects.postgresql import (
    UUID,
    JSONB,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.core.database import Base


# =========================================================
# PROJECTS
# =========================================================

class Project(Base):

    __tablename__ = "projects"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(
        String(200),
        nullable=False,
    )

    slug = Column(
        String(200),
        unique=True,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    github_url = Column(
        Text,
        nullable=True,
    )

    live_url = Column(
        Text,
        nullable=True,
    )

    demo_video_url = Column(
        String , 
        nullable=True
    )

    thumbnail_url = Column(
        Text,
        nullable=True,
    )

    gallery_urls = Column(
        JSONB,
        nullable=True,
        default=list,
    )

    tech_stack = Column(
        JSONB,
        nullable=True,
    )

    github_data = Column(
        JSONB,
        nullable=True,
    )

    stars_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    views_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    comments_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    is_featured = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="projects",
    )

    comments = relationship(
        "ProjectComment",
        back_populates="project",
        cascade="all, delete-orphan",
    )

    stars = relationship(
        "ProjectStar",
        back_populates="project",
        cascade="all, delete-orphan",
    )

    bookmarks = relationship(
        "ProjectBookmark",
        back_populates="project",
        cascade="all, delete-orphan",
    )


# =========================================================
# PROJECT STARS
# =========================================================

class ProjectStar(Base):

    __tablename__ = "project_stars"

    __table_args__ = (

        UniqueConstraint(
            "user_id",
            "project_id",
            name="unique_project_star",
        ),

    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

 

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="project_stars",
    )

    project = relationship(
        "Project",
        back_populates="stars",
    )


# =========================================================
# PROJECT COMMENTS  (replies live here too, via parent_id)
# =========================================================

class ProjectComment(Base):

    __tablename__ = "project_comments"

    __table_args__ = (

        Index(
            "ix_project_comments_parent_id",
            "parent_id",
        ),

        Index(
            "ix_project_comments_project_id",
            "project_id",
        ),

    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id"),
        nullable=False,
    )

    # Self-referential FK.
    # NULL  -> top-level comment.
    # set   -> this row is a reply to another comment.
    parent_id = Column(
        UUID(as_uuid=True),
        ForeignKey("project_comments.id", ondelete="CASCADE"),
        nullable=True,
    )

    content = Column(
        Text,
        nullable=False,
    )

    upvotes_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    downvotes_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    is_edited = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="project_comments",
    )

    project = relationship(
        "Project",
        back_populates="comments",
    )

    votes = relationship(
        "ProjectCommentVote",
        back_populates="comment",
        cascade="all, delete-orphan",
    )

    # Parent side of the self-join.
    # remote_side=[id] tells SQLAlchemy that `id` is the
    # "one" side, so `parent_id` is the "many" side.
    parent = relationship(
        "ProjectComment",
        remote_side=[id],
        back_populates="replies",
    )

    # Children side: all replies to this comment.
    replies = relationship(
        "ProjectComment",
        back_populates="parent",
        cascade="all, delete-orphan",
    )

    # =====================================================
    # COMPUTED SCORE
    # =====================================================

    @property
    def score(self):

        return (
            self.upvotes_count
            - self.downvotes_count
        )

    @property
    def is_reply(self):

        return self.parent_id is not None


# =========================================================
# PROJECT COMMENT VOTES
# =========================================================

class ProjectCommentVote(Base):


    __tablename__ = "project_comment_votes"

    __table_args__ = (

        UniqueConstraint(
            "user_id",
            "comment_id",
            name="unique_user_comment_vote",
        ),

        CheckConstraint(
            "vote_type IN ('up', 'down')",
            name="check_vote_type",
        ),

    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    comment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("project_comments.id"),
        nullable=False,
    )

    vote_type = Column(
        String(10),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="project_comment_votes",
    )

    comment = relationship(
        "ProjectComment",
        back_populates="votes",
    )




class ProjectBookmark(Base):

    __tablename__ = "project_bookmarks"

    __table_args__ = (

        UniqueConstraint(
            "user_id",
            "project_id",
            name="unique_project_bookmark",
        ),

    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # =========================================
    # RELATIONSHIPS
    # =========================================

    user = relationship(
        "User",
        back_populates="project_bookmarks",
    )

    project = relationship(
        "Project",
        back_populates="bookmarks",
    )