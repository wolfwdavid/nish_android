import uuid

from sqlalchemy import (
    Column,
    Text,
    Integer,
    DateTime,
    ForeignKey,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.core.database import Base


# =========================================================
# COMMENTS
# =========================================================

class Comment(Base):

    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    post_id = Column(
        UUID(as_uuid=True),
        ForeignKey("posts.id"),
        nullable=False,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    content = Column(Text, nullable=False)

    likes_count = Column(Integer, default=0, nullable=False)

    upvotes_count = Column(Integer, default=0, nullable=False)

    downvotes_count = Column(Integer, default=0, nullable=False)

    score = Column(Integer, default=0, nullable=False)



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

    post = relationship("Post", back_populates="comments")
