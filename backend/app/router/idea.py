from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db          # adjust to your session dep
from app.models.idea import Idea
from app.schema.idea import IdeaCreate, IdeaOut

router = APIRouter(prefix="/ideas", tags=["ideas"])


@router.post("", response_model=IdeaOut, status_code=201)
async def create_idea(
    payload: IdeaCreate,
    clerk_user_id: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    idea = Idea(
        title=payload.title.strip(),
        description=payload.description.strip(),
        category=payload.category,
        contact_email=payload.contact_email,
        page_url=payload.page_url,
        diagnostics=payload.diagnostics,
        clerk_user_id=clerk_user_id,
    )

    db.add(idea)
    await db.commit()
    await db.refresh(idea)
    return idea