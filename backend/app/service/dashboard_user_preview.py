from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_user_for_left_panel(
    db: AsyncSession,
    clerk_user_id: str
):

    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    return {
    "clerk_user_id": user.clerk_user_id,
    "avatar_url": user.avatar_url,
    "display_name": user.display_name,
    "username": user.username,
    "banner_url": user.banner_url
}