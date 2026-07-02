import uuid
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    func,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base






# =========================================================
# POSTS
# =========================================================

class Post(Base):

    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    header = Column(String(200), nullable=True)

    content = Column(Text, nullable=False)

    code_markdown = Column(Text, nullable=True)

    visibility = Column(String, default="public", nullable=False)

    likes_count = Column(Integer, default=0, nullable=False)

    comments_count = Column(Integer, default=0, nullable=False)

    views_count = Column(Integer, default=0, nullable=False)

    is_edited = Column(Boolean, default=False, nullable=False)

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

    user = relationship("User", back_populates="posts")

    media = relationship(
        "PostMedia",
        back_populates="post",
        cascade="all, delete-orphan",
    )

    comments = relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan",
    )


# =========================================================
# POST MEDIA
# =========================================================

class PostMedia(Base):

    __tablename__ = "post_media"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    post_id = Column(
        UUID(as_uuid=True),
        ForeignKey("posts.id"),
        nullable=False,
    )

    media_url = Column(Text, nullable=False)

    media_type = Column(String, nullable=False)

    order_index = Column(Integer, default=0, nullable=False)

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

    post = relationship("Post", back_populates="media")


# =========================================================
# POST LIKES
# =========================================================

class PostLike(Base):

    __tablename__ = "post_likes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    post_id = Column(
        UUID(as_uuid=True),
        ForeignKey("posts.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )



# =========================================================
# POST TAGS
# =========================================================

class PostTag(Base):

    __tablename__ = "post_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    post_id = Column(
        UUID(as_uuid=True),
        ForeignKey("posts.id"),
        nullable=False,
    )

    tag_id = Column(
        UUID(as_uuid=True),
        ForeignKey("tags.id"),
        nullable=False,
    )