from uuid import UUID

from fastapi import APIRouter, Depends, Query

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.admin import require_admin

from app.service.admin import AdminService

from app.schema.admin import (
    AdminChangelogItem,
    AdminCreateChangelog,
    AdminDashboardResponse,
    AdminFeedbackItem,
    AdminProjectItem,
    AdminSupportTicketItem,
    AdminUpdateChangelog,
    AdminUpdateFeedback,
    AdminUpdateProject,
    AdminUpdateSupportTicket,
    AdminUpdateUser,
    AdminUserItem,
    AdminAppNoticeItem,
    AdminCreateAppNotice,
    AdminUpdateAppNotice,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =========================================================
# DASHBOARD
# =========================================================

@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse,
)
async def get_admin_dashboard(
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.get_dashboard()


# =========================================================
# FEEDBACK
# =========================================================

@router.get(
    "/feedback",
    response_model=list[AdminFeedbackItem],
)
async def list_admin_feedback(
    status: str | None = Query(default=None),
    limit: int = Query(default=50, le=100),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.list_feedback(
        status_filter=status,
        limit=limit,
    )


@router.patch(
    "/feedback/{feedback_id}",
    response_model=AdminFeedbackItem,
)
async def update_admin_feedback(
    feedback_id: UUID,
    payload: AdminUpdateFeedback,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.update_feedback(
        feedback_id=feedback_id,
        payload=payload,
    )


# =========================================================
# SUPPORT
# =========================================================

@router.get(
    "/support-tickets",
    response_model=list[AdminSupportTicketItem],
)
async def list_admin_support_tickets(
    status: str | None = Query(default=None),
    limit: int = Query(default=50, le=100),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.list_support_tickets(
        status_filter=status,
        limit=limit,
    )


@router.patch(
    "/support-tickets/{ticket_id}",
    response_model=AdminSupportTicketItem,
)
async def update_admin_support_ticket(
    ticket_id: UUID,
    payload: AdminUpdateSupportTicket,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.update_support_ticket(
        ticket_id=ticket_id,
        payload=payload,
    )


# =========================================================
# USERS
# =========================================================

@router.get(
    "/users",
    response_model=list[AdminUserItem],
)
async def list_admin_users(
    limit: int = Query(default=50, le=100),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.list_users(
        limit=limit,
    )


@router.patch(
    "/users/{user_id}",
    response_model=AdminUserItem,
)
async def update_admin_user(
    user_id: UUID,
    payload: AdminUpdateUser,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.update_user(
        user_id=user_id,
        payload=payload,
    )


# =========================================================
# PROJECTS
# =========================================================

@router.get(
    "/projects",
    response_model=list[AdminProjectItem],
)
async def list_admin_projects(
    limit: int = Query(default=50, le=100),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.list_projects(
        limit=limit,
    )


@router.patch(
    "/projects/{project_id}",
    response_model=AdminProjectItem,
)
async def update_admin_project(
    project_id: UUID,
    payload: AdminUpdateProject,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.update_project(
        project_id=project_id,
        payload=payload,
    )


# =========================================================
# CHANGELOGS
# =========================================================

@router.get(
    "/changelogs",
    response_model=list[AdminChangelogItem],
)
async def list_admin_changelogs(
    limit: int = Query(default=50, le=100),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.list_changelogs(
        limit=limit,
    )


@router.post(
    "/changelogs",
    response_model=AdminChangelogItem,
)
async def create_admin_changelog(
    payload: AdminCreateChangelog,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.create_changelog(
        payload=payload,
    )


@router.patch(
    "/changelogs/{changelog_id}",
    response_model=AdminChangelogItem,
)
async def update_admin_changelog(
    changelog_id: UUID,
    payload: AdminUpdateChangelog,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.update_changelog(
        changelog_id=changelog_id,
        payload=payload,
    )


@router.delete(
    "/changelogs/{changelog_id}",
)
async def delete_admin_changelog(
    changelog_id: UUID,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.delete_changelog(
        changelog_id=changelog_id,
    )

# =========================================================
# APP NOTICES
# =========================================================

@router.get(
    "/app-notices",
    response_model=list[AdminAppNoticeItem],
)
async def list_admin_app_notices(
    limit: int = Query(default=50, le=100),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.list_app_notices(
        limit=limit,
    )


@router.post(
    "/app-notices",
    response_model=AdminAppNoticeItem,
)
async def create_admin_app_notice(
    payload: AdminCreateAppNotice,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.create_app_notice(
        payload=payload,
    )


@router.patch(
    "/app-notices/{notice_id}",
    response_model=AdminAppNoticeItem,
)
async def update_admin_app_notice(
    notice_id: UUID,
    payload: AdminUpdateAppNotice,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.update_app_notice(
        notice_id=notice_id,
        payload=payload,
    )


@router.delete(
    "/app-notices/{notice_id}",
)
async def delete_admin_app_notice(
    notice_id: UUID,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AdminService(db)

    return await service.delete_app_notice(
        notice_id=notice_id,
    )