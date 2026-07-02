from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.liveProjects import (
    GetFeedEvent,
)

from app.service.LiveProjects import (
    get_feed_events,
)


router = APIRouter(

    prefix="/feed-events",

    tags=["Feed Events"],

)


# =========================================================
# GET FEED EVENTS
# =========================================================

@router.get(

    "",

    response_model=list[GetFeedEvent],

)

async def get_feed(

    db: AsyncSession = Depends(get_db),

):

    return await get_feed_events(

        db=db,

    )