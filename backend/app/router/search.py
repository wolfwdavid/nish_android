from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.get("/users")
async def search_users(
    q: str = Query(default=""),
    limit: int = Query(default=10, le=30),
    db: AsyncSession = Depends(get_db),
):
    cleaned_query = q.strip().lower()

    if not cleaned_query:
        return []

    stmt = (
        select(User)
        .where(
            User.is_active == True,
            User.is_banned == False,
            or_(
                User.username_lower.ilike(
                    f"%{cleaned_query}%"
                ),
                func.lower(User.display_name).ilike(
                    f"%{cleaned_query}%"
                ),
            ),
        )
        .order_by(
            User.followers_count.desc(),
            User.created_at.desc(),
        )
        .limit(limit)
    )

    result = await db.execute(stmt)

    users = result.scalars().all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "avatar_url": user.avatar_url,
            "bio": user.bio,
            "location": user.location,
            "followers_count": user.followers_count,
            "project_count": user.project_count,
            "is_verified": user.is_verified,
        }
        for user in users
    ]