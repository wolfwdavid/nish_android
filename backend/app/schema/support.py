# app/schemas/support_ticket.py
from datetime import datetime
from typing import Optional, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

from app.models.support import TicketCategory, TicketStatus, TicketPriority


class SupportTicketCreate(BaseModel):
    category: TicketCategory
    subject: str = Field(..., min_length=1, max_length=120)
    description: str = Field(..., min_length=1, max_length=2000)
    project_id: Optional[UUID] = None
    diagnostics: Optional[dict[str, Any]] = None


class SupportTicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ticket_number: str
    category: TicketCategory
    subject: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    project_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]


class SupportTicketAdminUpdate(BaseModel):
    """Admin-only fields. Never expose to regular users."""
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    internal_notes: Optional[str] = None