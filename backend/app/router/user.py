from fastapi import APIRouter, Depends, Query

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.user import (
    UserSync,
    UserOnboarding,
    UserResponse,
)

from app.service.user import (
    sync_user,
    complete_onboarding,
    get_user_by_clerk_id,
)


router = APIRouter(
    prefix="/sync_user",
    tags=["Sync User"],
)


# =========================================================
# SYNC USER
# =========================================================

@router.post(
    "/",
    response_model=UserResponse,
)
async def sync_user_route(
    data: UserSync,
    db: AsyncSession = Depends(get_db),
):

    return await sync_user(
        db=db,
        data=data,
    )


# =========================================================
# COMPLETE ONBOARDING
# =========================================================

@router.post(
    "/onboarding",
    response_model=UserResponse,
)
async def complete_onboarding_route(
    data: UserOnboarding,
    db: AsyncSession = Depends(get_db),
):

    return await complete_onboarding(
        db=db,
        data=data,
    )


# =========================================================
# GET USER DATA
# =========================================================

@router.get(
    "/onboarding",
    response_model=UserResponse,
)
async def get_user_data(
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    return await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

