# app/models/support_ticket.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, ForeignKey, Enum as SQLEnum, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class TicketCategory(str, enum.Enum):
    bug = "bug"
    account = "account"
    integration = "integration"
    feature_not_working = "feature_not_working"
    other = "other"


class TicketStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    waiting_on_user = "waiting_on_user"
    resolved = "resolved"
    closed = "closed"


class TicketPriority(str, enum.Enum):
    low = "low"
    normal = "normal"
    high = "high"
    urgent = "urgent"


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Human-readable ticket number, e.g. "CG-0042"
    # Generated server-side via a sequence — see note below the model
    ticket_number = Column(String(16), unique=True, nullable=False, index=True)

    # Who filed it
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # Optional project context
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)

    # Core content
    category = Column(SQLEnum(TicketCategory, name="ticket_category"), nullable=False)
    subject = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)

    # Workflow
    status = Column(SQLEnum(TicketStatus, name="ticket_status"), nullable=False, default=TicketStatus.open, index=True)
    priority = Column(SQLEnum(TicketPriority, name="ticket_priority"), nullable=False, default=TicketPriority.normal)

    # Optional diagnostic snapshot (user agent, OS, page URL, app version, etc.)
    diagnostics = Column(JSONB, nullable=True)

    # Admin notes (never shown to user)
    internal_notes = Column(Text, nullable=True)

    # Resolution metadata
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolved_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="support_tickets")
    project = relationship("Project", foreign_keys=[project_id])
    resolved_by = relationship("User", foreign_keys=[resolved_by_user_id])