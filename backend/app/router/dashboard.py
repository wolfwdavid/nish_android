from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schema.dashboard import DashboardResponse
from app.service.dashboard import get_dashboard_data


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
async def get_dashboard(
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    return await get_dashboard_data(
        db=db,
        clerk_user_id=clerk_user_id,
    )