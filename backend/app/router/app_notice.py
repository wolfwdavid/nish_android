from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.app_notice import AppNotice
from app.schema.app_notice import PublicAppNoticeItem


router = APIRouter(
    prefix="/app-notices",
    tags=["App Notices"],
)


@router.get(
    "/active",
    response_model=PublicAppNoticeItem | None,
)
async def get_active_app_notice(
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(AppNotice)
        .where(AppNotice.is_active == True)
        .where(
            or_(
                AppNotice.starts_at == None,
                AppNotice.starts_at <= now,
            )
        )
        .where(
            or_(
                AppNotice.expires_at == None,
                AppNotice.expires_at >= now,
            )
        )
        .order_by(
            AppNotice.priority.desc(),
            AppNotice.created_at.desc(),
        )
        .limit(1)
    )

    return result.scalar_one_or_none()