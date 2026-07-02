from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    UniqueConstraint,
    func,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from app.core.database import Base

import uuid


# =========================================================
# USERS
# =========================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    clerk_user_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    username = Column(
        String(32),
        unique=True,
        nullable=False,
        index=True,
    )

    username_lower = Column(
        String(32),
        unique=True,
        nullable=False,
        index=True,
    )

    display_name = Column(
        String(100),
        nullable=True,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    bio = Column(
        String(280),
        nullable=True,
    )

    avatar_url = Column(
        Text,
        nullable=True,
    )

    banner_url = Column(
        Text,
        nullable=True,
    )

    github_url = Column(
        Text,
        nullable=True,
    )

    linkedin_url = Column(
        Text,
        nullable=True,
    )

    portfolio_url = Column(
        Text,
        nullable=True,
    )

    instagram_url = Column(
        Text,
        nullable=True,
    )

    location = Column(
        String(120),
        nullable=True,
    )

    current_build = Column(
        String(160),
        nullable=True,
    )

    reputation_score = Column(
        Integer,
        default=0,
        nullable=False,
    )

    followers_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    following_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    posts_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    project_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    reports_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    onboarding_completed = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_verified = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_private = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_banned = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    last_seen_at = Column(
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

    posts = relationship(
        "Post",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    projects = relationship(
        "Project",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    project_stars = relationship(
        "ProjectStar",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    project_comments = relationship(
        "ProjectComment",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    project_comment_votes = relationship(
        "ProjectCommentVote",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    stack_stats = relationship(
        "UserStackStat",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    project_bookmarks = relationship(
        "ProjectBookmark",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    live_projects = relationship(
        "LiveProject" , 
        back_populates="user" , 
        cascade="all, delete-orphan"
    )

    live_project_journals = relationship(
        "LiveProjectJournal" , 
        back_populates="user" , 
        cascade="all, delete-orphan"
    )

    live_project_journal_likes = relationship(
    "LiveProjectJournalLike",
    back_populates="user",
    cascade="all, delete-orphan",
    )

    live_project_journal_comments = relationship(
        "LiveProjectJournalComment",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    feed_events = relationship(
        "FeedEvent",
        back_populates="user",
        cascade="all, delete-orphan",
    )


    support_tickets = relationship(
        "SupportTicket",
        foreign_keys="SupportTicket.user_id",
        back_populates="user",
    )

    feedback_items = relationship(
        "Feedback",
        foreign_keys="Feedback.user_id",
        back_populates="user",

    )

    following_relations = relationship(
        "Follow",
        foreign_keys="Follow.follower_id",
        back_populates="follower",
        cascade="all, delete-orphan",
        )

    follower_relations = relationship(
        "Follow",
        foreign_keys="Follow.following_id",
        back_populates="following",
        cascade="all, delete-orphan",
    )




# =========================================================
# FOLLOWS
# =========================================================

class Follow(Base):

    __tablename__ = "follows"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    follower_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    following_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    follower = relationship(
        "User",
        foreign_keys=[follower_id],
        back_populates="following_relations",
    )

    following = relationship(
        "User",
        foreign_keys=[following_id],
        back_populates="follower_relations",
    )

    __table_args__ = (
        UniqueConstraint(
            "follower_id",
            "following_id",
            name="uq_follower_following",
        ),
    )



class UserStackStat(Base):

    __tablename__ = "user_stack_stats"

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

    stack_name = Column(
        String,
        nullable=False,
    )

    projects_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    live_projects_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    journal_entries_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    score = Column(
        Integer,
        default=0,
        nullable=False,
    )

    level = Column(
        Integer,
        default=1,
        nullable=False,
    )

    last_used_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="stack_stats",
    )