import uuid

from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.sql import func

from app.core.database import Base




# =========================================================
# TAGS
# =========================================================

class Tag(Base):

    __tablename__ = "tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String(50), unique=True, nullable=False)

    slug = Column(String(50), unique=True, nullable=False)

    posts_count = Column(Integer, default=0, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


