from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.follow import FollowStatus

from app.service.follow import (
    follow_user,
    unfollow_user,
    check_follow_status,
)


router = APIRouter(
    prefix="/users",
    tags=["Follows"],
)


# =========================================================
# FOLLOW USER
# =========================================================

@router.post(
    "/{username}/follow",
    response_model=FollowStatus,
)
async def follow_single_user(
    username: str,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),
):
    return await follow_user(
        db=db,
        clerk_user_id=clerk_user_id,
        username=username,
    )


# =========================================================
# UNFOLLOW USER
# =========================================================

@router.delete(
    "/{username}/follow",
    response_model=FollowStatus,
)
async def unfollow_single_user(
    username: str,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),
):
    return await unfollow_user(
        db=db,
        clerk_user_id=clerk_user_id,
        username=username,
    )


# =========================================================
# CHECK FOLLOW STATUS
# =========================================================

@router.get(
    "/{username}/follow-status",
    response_model=FollowStatus,
)
async def get_follow_status(
    username: str,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),
):
    return await check_follow_status(
        db=db,
        clerk_user_id=clerk_user_id,
        username=username,
    )