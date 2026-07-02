from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 
from fastapi import Depends, Header

from app.models.user import User 


from .database import get_db 



async def get_current_user_optional(
    clerk_user_id: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db),
):

    if not clerk_user_id:
        return None

    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    return user