from app.core.database import Base

import uuid

from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    CheckConstraint,
    UniqueConstraint,
    Index,
    text,
)

from sqlalchemy.dialects.postgresql import (
    UUID,
    JSONB,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func


# =========================================================
# LIVE PROJECTS
# =========================================================

class LiveProject(Base):

    __tablename__ = "live_projects"

    __table_args__ = (

        UniqueConstraint(
            "user_id",
            "slug",
            name="unique_user_live_project_slug",
        ),

        CheckConstraint(
            "status IN ('active', 'paused', 'completed', 'abandoned')",
            name="check_live_project_status",
        ),

        CheckConstraint(
            "progress_percentage BETWEEN 0 AND 100",
            name="check_live_project_progress_percentage",
        ),

        Index(
            "ix_live_projects_user_id_created_at",
            "user_id",
            "created_at",
        ),

        Index(
            "ix_live_projects_public_feed",
            "created_at",
            postgresql_where=text("is_public = true"),
        ),

    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(
        String(200),
        nullable=False,
    )

    slug = Column(
        String(200),
        nullable=False,
    )

    goal = Column(
        Text,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    current_status = Column(
        Text,
        nullable=True,
    )

    current_goal = Column(
        Text,
        nullable=True,
    )

    progress_percentage = Column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )

    status = Column(
        String(20),
        default="active",
        server_default="active",
        nullable=False,
    )

    category = Column(
        String(100),
        nullable=True,
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
        Text,
        nullable=True,
    )

    thumbnail_url = Column(
        Text,
        nullable=True,
    )

    gallery_urls = Column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )

    tech_stack = Column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )

    is_public = Column(
        Boolean,
        default=True,
        server_default="true",
        nullable=False,
    )

    is_featured = Column(
        Boolean,
        default=False,
        server_default="false",
        nullable=False,
    )

    is_draft = Column(
        Boolean,
        default=False,
        server_default="false",
        nullable=False,
    )

    views_count = Column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )

    journal_count = Column(
        Integer,
        default=0,
        server_default="0",
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

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="live_projects",
    )

    journals = relationship(
        "LiveProjectJournal",
        back_populates="live_project",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    feed_events = relationship(
        "FeedEvent",
        back_populates="live_project",
        cascade="all, delete-orphan",
    )


# =========================================================
# LIVE PROJECT JOURNALS
# =========================================================

class LiveProjectJournal(Base):

    __tablename__ = "live_project_journals"

    __table_args__ = (

        CheckConstraint(
            """
            entry_type IN (
                'progress',
                'milestone',
                'bugfix',
                'deployment',
                'architecture',
                'announcement',
                'failure'
            )
            """,
            name="check_live_project_journal_type",
        ),

        CheckConstraint(
            "progress_percentage IS NULL OR progress_percentage BETWEEN 0 AND 100",
            name="check_live_project_journal_progress_percentage",
        ),

        Index(
            "ix_live_project_journals_project_created_at",
            "live_project_id",
            "created_at",
        ),

        Index(
            "ix_live_project_journals_user_created_at",
            "user_id",
            "created_at",
        ),

    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    live_project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("live_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    day_number = Column(
        Integer,
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    entry_type = Column(
        String(50),
        default="progress",
        server_default="progress",
        nullable=False,
    )

    media_urls = Column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )

    code_snippets = Column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )

    problem_solutions = Column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )

    progress_percentage = Column(
        Integer,
        nullable=True,
    )

    likes_count = Column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )

    comments_count = Column(
        Integer,
        default=0,
        server_default="0",
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

    live_project = relationship(
        "LiveProject",
        back_populates="journals",
    )

    user = relationship(
        "User",
        back_populates="live_project_journals",
    )

    likes = relationship(
        "LiveProjectJournalLike",
        back_populates="journal",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    comments = relationship(
        "LiveProjectJournalComment",
        back_populates="journal",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


# =========================================================
# LIVE PROJECT JOURNAL LIKES
# =========================================================

class LiveProjectJournalLike(Base):

    __tablename__ = "live_project_journal_likes"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "journal_id",
            name="unique_live_project_journal_like",
        ),
    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    journal_id = Column(
        UUID(as_uuid=True),
        ForeignKey("live_project_journals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="live_project_journal_likes",
    )

    journal = relationship(
        "LiveProjectJournal",
        back_populates="likes",
    )


# =========================================================
# LIVE PROJECT JOURNAL COMMENTS
# =========================================================

class LiveProjectJournalComment(Base):

    __tablename__ = "live_project_journal_comments"

    __table_args__ = (
    Index(
        "ix_live_project_journal_comments_journal_created_at",
        "journal_id",
        "created_at",
    ),
)

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    journal_id = Column(
        UUID(as_uuid=True),
        ForeignKey("live_project_journals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    parent_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "live_project_journal_comments.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    content = Column(
        Text,
        nullable=False,
    )

    likes_count = Column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )

    is_edited = Column(
        Boolean,
        default=False,
        server_default="false",
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

    user = relationship(
        "User",
        back_populates="live_project_journal_comments",
    )

    journal = relationship(
        "LiveProjectJournal",
        back_populates="comments",
    )

    parent = relationship(
        "LiveProjectJournalComment",
        remote_side=[id],
        back_populates="replies",
    )

    replies = relationship(
        "LiveProjectJournalComment",
        back_populates="parent",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    @property
    def is_reply(self):
        return self.parent_id is not None
    


class FeedEvent(Base):

    __tablename__ = "feed_events"

    __table_args__ = (

        Index(
            "ix_feed_events_created_at",
            "created_at",
        ),

        Index(
            "ix_feed_events_user_created_at",
            "user_id",
            "created_at",
        ),

        Index(
            "ix_feed_events_project_created_at",
            "live_project_id",
            "created_at",
        ),

    )



    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )



    # WHO DID THE ACTION

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )



    # RELATED LIVE PROJECT

    live_project_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "live_projects.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )



    # EVENT TYPE

    event_type = Column(
        String(50),
        nullable=False,
    )



    # MAIN CONTENT

    content = Column(
        Text,
        nullable=True,
    )



    # FLEXIBLE PAYLOAD

    event_metadata = Column(
    JSONB,
    nullable=False,
    default=dict,
    server_default=text("'{}'::jsonb"),
)


    # ENGAGEMENT

    likes_count = Column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )

    comments_count = Column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )



    # VISIBILITY

    is_public = Column(
        Boolean,
        default=True,
        server_default="true",
        nullable=False,
    )



    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )



    # RELATIONSHIPS

    user = relationship(
        "User",
        back_populates="feed_events",
    )

    live_project = relationship(
        "LiveProject",
    )