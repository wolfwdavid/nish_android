from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.liveProjects import *

from app.service.LiveProjects import *


router = APIRouter(
    prefix="/live-projects",
    tags=["Live Projects"],
)


# =========================================================
# CREATE LIVE PROJECT
# =========================================================

@router.post(
    "",
    response_model=GetLiveProject,
)

async def create_new_live_project(

    data: CreateLiveProject,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await create_live_project(

        db=db,

        clerk_user_id=clerk_user_id,

        data=data,

    )

@router.get(
    "/{slug}/latest-commit",
)
async def get_latest_commit(
    slug: str,
    db: AsyncSession = Depends(get_db),
):

    return await fetch_latest_commit(
        db=db,
        slug=slug,
    )


# =========================================================
# GET SINGLE LIVE PROJECT
# =========================================================

@router.get(
    "/{slug}",
    response_model=GetLiveProject,
)

async def get_live_project_by_slug(

    slug: str,

    db: AsyncSession = Depends(get_db),

):

    return await get_single_live_project(

        db=db,

        slug=slug,

    )


# =========================================================
# UPDATE LIVE PROJECT
# =========================================================

@router.patch(
    "/{slug}",
    response_model=GetLiveProject,
)

async def update_single_live_project(

    slug: str,

    data: UpdateLiveProject,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await update_live_project(

        db=db,

        slug=slug,

        clerk_user_id=clerk_user_id,

        data=data,

    )


# =========================================================
# DELETE LIVE PROJECT
# =========================================================

@router.delete(
    "/{slug}",
)

async def delete_single_live_project(

    slug: str,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await delete_live_project(

        db=db,

        slug=slug,

        clerk_user_id=clerk_user_id,

    )


# =========================================================
# CREATE JOURNAL ENTRY
# =========================================================

@router.post(
    "/{slug}/journals",
    response_model=GetLiveProjectJournal,
)

async def create_journal_entry(

    slug: str,

    data: CreateLiveProjectJournal,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await create_live_project_journal(

        db=db,

        slug=slug,

        clerk_user_id=clerk_user_id,

        data=data,

    )


# =========================================================
# GET PROJECT JOURNALS
# =========================================================

@router.get(
    "/{slug}/journals",
    response_model=list[GetLiveProjectJournal],
)

async def get_project_journals(

    slug: str,

    db: AsyncSession = Depends(get_db),

):

    return await get_live_project_journals(

        db=db,

        slug=slug,

    )


# =========================================================
# CREATE JOURNAL COMMENT
# =========================================================

@router.post(
    "/journals/{journal_id}/comments",
    response_model=GetLiveProjectJournalComment,
)

async def create_journal_comment(

    journal_id: UUID,

    data: CreateLiveProjectJournalComment,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await create_live_project_journal_comment(

        db=db,

        journal_id=journal_id,

        clerk_user_id=clerk_user_id,

        data=data,

    )


# =========================================================
# LIKE JOURNAL
# =========================================================

@router.post(
    "/journals/{journal_id}/like",
)

async def like_journal(

    journal_id: UUID,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await like_live_project_journal(

        db=db,

        journal_id=journal_id,

        clerk_user_id=clerk_user_id,

    )


# =========================================================
# UNLIKE JOURNAL
# =========================================================

@router.delete(
    "/journals/{journal_id}/like",
)

async def unlike_journal(

    journal_id: UUID,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await unlike_live_project_journal(

        db=db,

        journal_id=journal_id,

        clerk_user_id=clerk_user_id,

    )


# =========================================================
# LIVE PROJECT FEED
# =========================================================

@router.get(
    "",
    response_model=list[GetLiveProject],
)

async def get_live_projects(

    db: AsyncSession = Depends(get_db),

):

    return await get_live_projects_feed(

        db=db,

    )



# =========================================================
# UPDATE JOURNAL ENTRY
# =========================================================

@router.patch(
    "/journals/{journal_id}",
    response_model=GetLiveProjectJournal,
)

async def update_journal_entry(

    journal_id: UUID,

    data: UpdateLiveProjectJournal,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await update_live_project_journal(

        db=db,

        journal_id=journal_id,

        clerk_user_id=clerk_user_id,

        data=data,

    )


# =========================================================
# DELETE JOURNAL ENTRY
# =========================================================

@router.delete(
    "/journals/{journal_id}",
)

async def delete_journal_entry(

    journal_id: UUID,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await delete_live_project_journal(

        db=db,

        journal_id=journal_id,

        clerk_user_id=clerk_user_id,

    )


# =========================================================
# GET JOURNAL COMMENTS
# =========================================================

@router.get(
    "/journals/{journal_id}/comments",
    response_model=list[GetLiveProjectJournalComment],
)

async def get_journal_comments(

    journal_id: UUID,

    db: AsyncSession = Depends(get_db),

):

    return await get_live_project_journal_comments(

        db=db,

        journal_id=journal_id,

    )



# =========================================================
# UPDATE JOURNAL COMMENT
# =========================================================

@router.patch(
    "/comments/{comment_id}",
    response_model=GetLiveProjectJournalComment,
)

async def update_journal_comment(

    comment_id: UUID,

    data: UpdateLiveProjectJournalComment,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await update_live_project_journal_comment(

        db=db,

        comment_id=comment_id,

        clerk_user_id=clerk_user_id,

        data=data,

    )



# =========================================================
# DELETE JOURNAL COMMENT
# =========================================================

@router.delete(
    "/comments/{comment_id}",
)

async def delete_journal_comment(

    comment_id: UUID,

    clerk_user_id: str = Query(...),

    db: AsyncSession = Depends(get_db),

):

    return await delete_live_project_journal_comment(

        db=db,

        comment_id=comment_id,

        clerk_user_id=clerk_user_id,

    )



