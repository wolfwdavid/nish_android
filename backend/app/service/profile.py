from fastapi import HTTPException

from app.models.user import User 
from app.schema.profile import get_profile_data , update_profile_data 
from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy import select 


async def get_user_profile_data(
    db: AsyncSession,
    username: str,
) -> get_profile_data:

    user = await db.scalar(
        select(User).where(
            User.username == username
        )
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {

        "id": user.id,

        "clerk_user_id": user.clerk_user_id,

        "username": user.username,

        "display_name": user.display_name,

        "email": user.email,

        "bio": user.bio,

        "avatar_url": user.avatar_url,

        "banner_url": user.banner_url,

        "github_url": user.github_url,

        "linkedin_url": user.linkedin_url,

        "portfolio_url": user.portfolio_url,

        "instagram_url": user.instagram_url,

        "reputation_score": user.reputation_score,

        "followers_count": user.followers_count,

        "following_count": user.following_count,

        "posts_count": user.posts_count,

        "project_count": user.project_count,

        "location": user.location,

        "current_build": user.current_build,

        "joined_date": (
            user.created_at.strftime(
                "Joined %b %Y"
            )
            if user.created_at
            else "Joined recently"
        ),
    }
async def update_user_profile_data(
    db: AsyncSession,
    clerk_user_id: str,
    data: update_profile_data,
):

    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    user.username = data.username

    user.display_name = data.display_name

    user.bio = data.bio

    user.avatar_url = data.avatar_url

    user.banner_url = data.banner_url
    user.instagram_url = data.instagram_url

    user.location = data.location

    user.current_build = data.current_build

    user.github_url = data.github_url

    user.linkedin_url = data.linkedin_url

    user.portfolio_url = data.portfolio_url


    await db.commit()

    await db.refresh(user)


    return user


async def get_my_profile_data(
    db: AsyncSession,
    clerk_user_id: str,
) -> get_profile_data:

    result = await db.execute(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user