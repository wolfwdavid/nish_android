import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    Text,
    func,
)

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class AppNotice(Base):
    __tablename__ = "app_notices"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    title = Column(
        String(160),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    notice_type = Column(
        String(40),
        nullable=False,
        default="info",
        index=True,
    )

    cta_label = Column(
        String(80),
        nullable=True,
    )

    cta_href = Column(
        Text,
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    show_once = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    priority = Column(
        Integer,
        nullable=False,
        default=0,
        index=True,
    )

    starts_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
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