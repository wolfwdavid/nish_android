from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, Follow


# =========================================================
# HELPERS
# =========================================================

async def get_user_by_clerk_id(
    db: AsyncSession,
    clerk_user_id: str,
):
    result = await db.execute(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Current user not found",
        )

    return user


async def get_user_by_username(
    db: AsyncSession,
    username: str,
):
    result = await db.execute(
        select(User).where(
            User.username_lower == username.lower()
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Target user not found",
        )

    return user


async def get_existing_follow(
    db: AsyncSession,
    follower_id,
    following_id,
):
    result = await db.execute(
        select(Follow).where(
            Follow.follower_id == follower_id,
            Follow.following_id == following_id,
        )
    )

    return result.scalar_one_or_none()


# =========================================================
# FOLLOW USER
# =========================================================

async def follow_user(
    db: AsyncSession,
    clerk_user_id: str,
    username: str,
):
    current_user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    target_user = await get_user_by_username(
        db=db,
        username=username,
    )

    if current_user.id == target_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot follow yourself",
        )

    existing_follow = await get_existing_follow(
        db=db,
        follower_id=current_user.id,
        following_id=target_user.id,
    )

    if existing_follow:
        raise HTTPException(
            status_code=409,
            detail="You are already following this user",
        )

    follow = Follow(
        follower_id=current_user.id,
        following_id=target_user.id,
    )

    db.add(follow)

    current_user.following_count = (current_user.following_count or 0) + 1

    target_user.followers_count = (target_user.followers_count or 0) + 1

    await db.commit()
    await db.refresh(follow)
    await db.refresh(current_user)
    await db.refresh(target_user)

    return {
        "is_following": True,
        "followers_count": target_user.followers_count,
        "following_count": current_user.following_count,
    }


# =========================================================
# UNFOLLOW USER
# =========================================================

async def unfollow_user(
    db: AsyncSession,
    clerk_user_id: str,
    username: str,
):
    current_user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    target_user = await get_user_by_username(
        db=db,
        username=username,
    )

    if current_user.id == target_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot unfollow yourself",
        )

    existing_follow = await get_existing_follow(
        db=db,
        follower_id=current_user.id,
        following_id=target_user.id,
    )

    if not existing_follow:
        raise HTTPException(
            status_code=404,
            detail="You are not following this user",
        )

    await db.delete(existing_follow)

    current_user.following_count = max(
        0,
        current_user.following_count - 1,
    )

    target_user.followers_count = max(
        0,
        target_user.followers_count - 1,
    )

    await db.commit()
    await db.refresh(current_user)
    await db.refresh(target_user)

    return {
        "is_following": False,
        "followers_count": target_user.followers_count,
        "following_count": current_user.following_count,
    }


# =========================================================
# CHECK FOLLOW STATUS
# =========================================================

async def check_follow_status(
    db: AsyncSession,
    clerk_user_id: str,
    username: str,
):
    current_user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    target_user = await get_user_by_username(
        db=db,
        username=username,
    )

    existing_follow = await get_existing_follow(
        db=db,
        follower_id=current_user.id,
        following_id=target_user.id,
    )

    return {
        "is_following": existing_follow is not None,
        "followers_count": target_user.followers_count,
        "following_count": current_user.following_count,
    }