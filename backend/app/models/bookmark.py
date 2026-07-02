import uuid

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.sql import func

from app.core.database import Base



# =========================================================
# BOOKMARKS
# =========================================================

class Bookmark(Base):

    __tablename__ = "bookmarks"

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