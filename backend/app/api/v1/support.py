from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Request,
    Query,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.support import (
    SupportTicketCreate,
    SupportTicketResponse,
    SupportTicketAdminUpdate,
)

from app.models.support import (
    TicketCategory,
    TicketStatus,
    TicketPriority,
)

from app.service.support import SupportService


router = APIRouter(
    prefix="/support",
    tags=["Support"],
)


# =========================================================
# REQUEST DIAGNOSTICS
# =========================================================

def _extract_request_diagnostics(
    request: Request,
) -> dict:

    return {
        "user_agent": request.headers.get("user-agent"),
        "referer": request.headers.get("referer"),
        "ip": request.client.host if request.client else None,
    }


# =========================================================
# CREATE TICKET
# POST /support/tickets?clerk_user_id=xxx
# =========================================================

@router.post(
    "/tickets",
    response_model=SupportTicketResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_ticket(
    payload: SupportTicketCreate,
    request: Request,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    diagnostics = _extract_request_diagnostics(
        request
    )

    return await service.create_ticket(
        clerk_user_id=clerk_user_id,
        payload=payload,
        request_diagnostics=diagnostics,
    )


# =========================================================
# LIST MY TICKETS
# GET /support/tickets?clerk_user_id=xxx
# =========================================================

@router.get(
    "/tickets",
    response_model=list[SupportTicketResponse],
)
async def list_my_tickets(
    clerk_user_id: str = Query(...),
    ticket_status: TicketStatus | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    tickets, _total = await service.list_user_tickets(
        clerk_user_id=clerk_user_id,
        ticket_status=ticket_status,
        limit=limit,
        offset=offset,
    )

    return tickets


# =========================================================
# LIST MY OPEN TICKETS
# GET /support/tickets/open?clerk_user_id=xxx
# For top support page section.
# =========================================================

@router.get(
    "/tickets/open",
    response_model=list[SupportTicketResponse],
)
async def list_my_open_tickets(
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    return await service.list_user_open_tickets(
        clerk_user_id=clerk_user_id,
    )


# =========================================================
# GET SINGLE TICKET
# GET /support/tickets/{ticket_id}?clerk_user_id=xxx
# =========================================================

@router.get(
    "/tickets/{ticket_id}",
    response_model=SupportTicketResponse,
)
async def get_my_ticket(
    ticket_id: UUID,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    return await service.get_ticket_for_user(
        clerk_user_id=clerk_user_id,
        ticket_id=ticket_id,
    )


# =========================================================
# CLOSE MY TICKET
# PATCH /support/tickets/{ticket_id}/close?clerk_user_id=xxx
# =========================================================

@router.patch(
    "/tickets/{ticket_id}/close",
    response_model=SupportTicketResponse,
)
async def close_my_ticket(
    ticket_id: UUID,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    return await service.close_user_ticket(
        clerk_user_id=clerk_user_id,
        ticket_id=ticket_id,
    )


# =========================================================
# RESOLVE MY TICKET
# PATCH /support/tickets/{ticket_id}/resolve?clerk_user_id=xxx
# =========================================================

@router.patch(
    "/tickets/{ticket_id}/resolve",
    response_model=SupportTicketResponse,
)
async def resolve_my_ticket(
    ticket_id: UUID,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    return await service.resolve_user_ticket(
        clerk_user_id=clerk_user_id,
        ticket_id=ticket_id,
    )


# =========================================================
# ADMIN LIST TICKETS
# GET /support/admin/tickets
# Protect later.
# =========================================================

@router.get(
    "/admin/tickets",
    response_model=list[SupportTicketResponse],
)
async def admin_list_tickets(
    ticket_status: TicketStatus | None = Query(default=None),
    category: TicketCategory | None = Query(default=None),
    priority: TicketPriority | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    tickets, _total = await service.admin_list_tickets(
        ticket_status=ticket_status,
        category=category,
        priority=priority,
        limit=limit,
        offset=offset,
    )

    return tickets


# =========================================================
# ADMIN UPDATE TICKET
# PATCH /support/admin/tickets/{ticket_id}
# Protect later.
# =========================================================

@router.patch(
    "/admin/tickets/{ticket_id}",
    response_model=SupportTicketResponse,
)
async def admin_update_ticket(
    ticket_id: UUID,
    payload: SupportTicketAdminUpdate,
    db: AsyncSession = Depends(get_db),
):

    service = SupportService(db)

    return await service.admin_update_ticket(
        ticket_id=ticket_id,
        payload=payload,
    )