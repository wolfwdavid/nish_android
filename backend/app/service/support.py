from typing import Optional, Any
from uuid import UUID
from datetime import datetime, timezone

from fastapi import HTTPException, status

from sqlalchemy import select, func, text, case
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.models.support import (
    SupportTicket,
    TicketCategory,
    TicketStatus,
    TicketPriority,
)

from app.models.user import User
from app.models.project import Project

from app.schema.support import (
    SupportTicketCreate,
    SupportTicketAdminUpdate,
)


class SupportService:

    def __init__(
        self,
        db: AsyncSession,
    ):
        self.db = db


    # =========================================================
    # USER HELPERS
    # =========================================================

    async def get_user_by_clerk_user_id(
        self,
        clerk_user_id: str,
    ) -> User:

        result = await self.db.execute(
            select(User).where(
                User.clerk_user_id == clerk_user_id
            )
        )

        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return user


    # =========================================================
    # TICKET NUMBER GENERATION
    # Requires support_ticket_seq migration.
    # =========================================================

    async def _generate_ticket_number(
        self,
    ) -> str:

        result = await self.db.execute(
            text("SELECT nextval('support_ticket_seq')")
        )

        number = result.scalar_one()

        return f"CG-{number:04d}"


    # =========================================================
    # CREATE TICKET
    # =========================================================

    async def create_ticket(
        self,
        clerk_user_id: str,
        payload: SupportTicketCreate,
        request_diagnostics: Optional[dict[str, Any]] = None,
    ) -> SupportTicket:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        if payload.project_id is not None:
            await self._verify_project_ownership(
                project_id=payload.project_id,
                user_id=user.id,
            )

        diagnostics: Optional[dict[str, Any]] = None

        if payload.diagnostics or request_diagnostics:
            diagnostics = {
                **(payload.diagnostics or {}),
                **(request_diagnostics or {}),
            }

        ticket_number = await self._generate_ticket_number()

        ticket = SupportTicket(
            ticket_number=ticket_number,
            user_id=user.id,
            project_id=payload.project_id,
            category=payload.category,
            subject=payload.subject.strip(),
            description=payload.description.strip(),
            diagnostics=diagnostics,
            status=TicketStatus.open,
            priority=self._infer_initial_priority(
                payload.category
            ),
        )

        self.db.add(ticket)

        try:
            await self.db.commit()

        except IntegrityError as error:
            await self.db.rollback()

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not create ticket. Please try again.",
            ) from error

        await self.db.refresh(ticket)

        await self._notify_support_team(ticket)

        return ticket


    # =========================================================
    # GET SINGLE USER TICKET
    # =========================================================

    async def get_ticket_for_user(
        self,
        clerk_user_id: str,
        ticket_id: UUID,
    ) -> SupportTicket:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        result = await self.db.execute(
            select(SupportTicket).where(
                SupportTicket.id == ticket_id,
                SupportTicket.user_id == user.id,
            )
        )

        ticket = result.scalar_one_or_none()

        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found.",
            )

        return ticket


    # =========================================================
    # LIST USER TICKETS
    # For support page.
    # =========================================================

    async def list_user_tickets(
        self,
        clerk_user_id: str,
        ticket_status: Optional[TicketStatus] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[SupportTicket], int]:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        limit = min(
            max(limit, 1),
            100,
        )

        offset = max(
            offset,
            0,
        )

        filters = [
            SupportTicket.user_id == user.id
        ]

        if ticket_status is not None:
            filters.append(
                SupportTicket.status == ticket_status
            )

        items_query = (
            select(SupportTicket)
            .where(*filters)
            .order_by(
                SupportTicket.created_at.desc()
            )
            .limit(limit)
            .offset(offset)
        )

        count_query = (
            select(func.count(SupportTicket.id))
            .where(*filters)
        )

        items_result = await self.db.execute(items_query)
        count_result = await self.db.execute(count_query)

        return (
            list(items_result.scalars().all()),
            count_result.scalar_one(),
        )


    # =========================================================
    # LIST CURRENT OPEN USER TICKETS
    # For top "Your open case" section.
    # =========================================================

    async def list_user_open_tickets(
        self,
        clerk_user_id: str,
    ) -> list[SupportTicket]:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        result = await self.db.execute(
            select(SupportTicket)
            .where(
                SupportTicket.user_id == user.id,
                SupportTicket.status.in_(
                    [
                        TicketStatus.open,
                        TicketStatus.in_progress,
                        TicketStatus.waiting_on_user,
                    ]
                ),
            )
            .order_by(
                SupportTicket.created_at.desc()
            )
        )

        return list(result.scalars().all())


    # =========================================================
    # CLOSE USER TICKET
    # User can close his own ticket.
    # =========================================================

    async def close_user_ticket(
        self,
        clerk_user_id: str,
        ticket_id: UUID,
    ) -> SupportTicket:

        ticket = await self.get_ticket_for_user(
            clerk_user_id=clerk_user_id,
            ticket_id=ticket_id,
        )

        if ticket.status == TicketStatus.closed:
            return ticket

        ticket.status = TicketStatus.closed

        await self.db.commit()
        await self.db.refresh(ticket)

        return ticket


    # =========================================================
    # MARK USER TICKET RESOLVED
    # Useful when issue is fixed.
    # =========================================================

    async def resolve_user_ticket(
        self,
        clerk_user_id: str,
        ticket_id: UUID,
    ) -> SupportTicket:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        ticket = await self.get_ticket_for_user(
            clerk_user_id=clerk_user_id,
            ticket_id=ticket_id,
        )

        ticket.status = TicketStatus.resolved
        ticket.resolved_at = datetime.now(timezone.utc)
        ticket.resolved_by_user_id = user.id

        await self.db.commit()
        await self.db.refresh(ticket)

        return ticket


    # =========================================================
    # ADMIN UPDATE TICKET
    # Protect properly later.
    # =========================================================

    async def admin_update_ticket(
        self,
        ticket_id: UUID,
        payload: SupportTicketAdminUpdate,
    ) -> SupportTicket:

        result = await self.db.execute(
            select(SupportTicket).where(
                SupportTicket.id == ticket_id
            )
        )

        ticket = result.scalar_one_or_none()

        if ticket is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found.",
            )

        data = payload.model_dump(
            exclude_unset=True
        )

        new_status = data.get("status")

        if new_status is not None and new_status != ticket.status:
            if new_status == TicketStatus.resolved and ticket.resolved_at is None:
                ticket.resolved_at = datetime.now(timezone.utc)

            elif new_status != TicketStatus.resolved:
                ticket.resolved_at = None
                ticket.resolved_by_user_id = None

        for field, value in data.items():
            setattr(ticket, field, value)

        await self.db.commit()
        await self.db.refresh(ticket)

        return ticket


    # =========================================================
    # ADMIN LIST TICKETS
    # MVP. Add admin auth later.
    # =========================================================

    async def admin_list_tickets(
        self,
        ticket_status: Optional[TicketStatus] = None,
        category: Optional[TicketCategory] = None,
        priority: Optional[TicketPriority] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SupportTicket], int]:

        limit = min(
            max(limit, 1),
            100,
        )

        offset = max(
            offset,
            0,
        )

        filters = []

        if ticket_status is not None:
            filters.append(
                SupportTicket.status == ticket_status
            )

        if category is not None:
            filters.append(
                SupportTicket.category == category
            )

        if priority is not None:
            filters.append(
                SupportTicket.priority == priority
            )

        priority_rank = case(
            (
                SupportTicket.priority == TicketPriority.urgent,
                1,
            ),
            (
                SupportTicket.priority == TicketPriority.high,
                2,
            ),
            (
                SupportTicket.priority == TicketPriority.normal,
                3,
            ),
            (
                SupportTicket.priority == TicketPriority.low,
                4,
            ),
            else_=5,
        )

        open_rank = case(
            (
                SupportTicket.status == TicketStatus.open,
                1,
            ),
            (
                SupportTicket.status == TicketStatus.in_progress,
                2,
            ),
            (
                SupportTicket.status == TicketStatus.waiting_on_user,
                3,
            ),
            else_=4,
        )

        items_query = (
            select(SupportTicket)
            .where(*filters)
            .order_by(
                open_rank.asc(),
                priority_rank.asc(),
                SupportTicket.created_at.desc(),
            )
            .limit(limit)
            .offset(offset)
        )

        count_query = (
            select(func.count(SupportTicket.id))
            .where(*filters)
        )

        items_result = await self.db.execute(items_query)
        count_result = await self.db.execute(count_query)

        return (
            list(items_result.scalars().all()),
            count_result.scalar_one(),
        )


    # =========================================================
    # INTERNAL HELPERS
    # =========================================================

    async def _verify_project_ownership(
        self,
        project_id: UUID,
        user_id: UUID,
    ) -> None:

        result = await self.db.execute(
            select(Project.id).where(
                Project.id == project_id,
                Project.user_id == user_id,
            )
        )

        if result.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )


    def _infer_initial_priority(
        self,
        category: TicketCategory,
    ) -> TicketPriority:

        if category in (
            TicketCategory.account,
            TicketCategory.integration,
        ):
            return TicketPriority.high

        return TicketPriority.normal


    async def _notify_support_team(
        self,
        ticket: SupportTicket,
    ) -> None:

        # MVP: no email yet.
        # Later: Resend/Postmark/Slack webhook.
        pass