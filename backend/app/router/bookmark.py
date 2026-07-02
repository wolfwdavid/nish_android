from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.project import GetProject

from app.service.bookmark import (
    get_my_bookmarks,
)


router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"],
)


@router.get(
    "/me",
    response_model=list[GetProject],
)
async def get_bookmarked_projects(
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    return await get_my_bookmarks(
        db=db,
        clerk_user_id=clerk_user_id,
    )