from uuid import UUID

from fastapi import APIRouter, Depends , Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.dashboard_user_preview import (
    DashboardUserPreview
)

from app.service.dashboard_user_preview import (
    get_user_for_left_panel
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/",
    response_model=DashboardUserPreview,
)
async def get_left_panel_user_data(
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    return await get_user_for_left_panel(
        db=db,
        clerk_user_id=clerk_user_id,
    )