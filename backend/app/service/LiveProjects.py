from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.LiveProject import (
    LiveProject,
    LiveProjectJournal,
    LiveProjectJournalLike,
    LiveProjectJournalComment,
    FeedEvent
)

from app.models.user import User

from app.schema.liveProjects import (
    CreateLiveProject,
    UpdateLiveProject,
    CreateLiveProjectJournal,
    UpdateLiveProjectJournal,
    CreateLiveProjectJournalComment,
    UpdateLiveProjectJournalComment,
    CreateFeedEvent, 
    GetFeedEvent
)

from app.utility.project_utility import (
    generate_unique_slug,
    fetch_github_url,
)
import httpx

async def fetch_latest_commit(
    db: AsyncSession,
    slug: str,
):

    live_project = await db.scalar(
        select(LiveProject).where(
            LiveProject.slug == slug
        )
    )

    if not live_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    if not live_project.github_url:
        raise HTTPException(
            status_code=400,
            detail="No GitHub repository linked",
        )

    repo_path = (
        live_project.github_url
        .replace("https://github.com/", "")
        .strip("/")
    )

    github_api_url = (
        f"https://api.github.com/repos/"
        f"{repo_path}/commits"
    )

    async with httpx.AsyncClient() as client:

        response = await client.get(
            github_api_url
        )

    if response.status_code != 200:

        raise HTTPException(
            status_code=400,
            detail="Failed to fetch commits",
        )

    commits = response.json()

    if not commits:

        raise HTTPException(
            status_code=404,
            detail="No commits found",
        )

    latest = commits[0]

    return {

        "message":
            latest["commit"]["message"],

        "author":
            latest["commit"]["author"]["name"],

        "date":
            latest["commit"]["author"]["date"],

        "sha":
            latest["sha"],

        "url":
            latest["html_url"],

    }


# =========================================================
# HELPERS
# =========================================================

async def get_user_by_clerk_id(
    db: AsyncSession,
    clerk_user_id: str,
) -> User:

    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# =========================================================
# CREATE LIVE PROJECT
# =========================================================

async def create_live_project(
    db: AsyncSession,
    clerk_user_id: str,
    data: CreateLiveProject,
):
    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    final_slug = await generate_unique_slug(
        db=db,
        title=data.title,
        model=LiveProject,
        user_id=user.id,
    )

    verified_github_url = data.github_url
    detected_stack = data.tech_stack

    if data.github_url:
        verified_github_url, github_data, detected_stack = await fetch_github_url(
            data.github_url
        )

    new_live_project = LiveProject(
        user_id=user.id,
        title=data.title.strip(),
        slug=final_slug,
        goal=data.goal.strip(),
        description=data.description,
        current_status=data.current_status,
        current_goal=data.current_goal,
        progress_percentage=data.progress_percentage,
        category=data.category,
        github_url=verified_github_url,
        live_url=data.live_url,
        demo_video_url=data.demo_video_url,
        thumbnail_url=data.thumbnail_url,
        gallery_urls=data.gallery_urls,
        tech_stack=detected_stack,
        is_public=data.is_public,
        is_draft=data.is_draft,
    )

    db.add(new_live_project)

    await db.flush()

    await create_feed_event(
        db=db,
        user_id=user.id,
        live_project_id=new_live_project.id,
        event_type="live_project_created",
        content=f"Started building {new_live_project.title}",
        event_metadata={
            "goal": new_live_project.goal,
            "tech_stack": new_live_project.tech_stack or [],
        },
    )

    await db.commit()

    new_live_project = await db.scalar(
        select(LiveProject)
        .options(selectinload(LiveProject.user))
        .where(LiveProject.id == new_live_project.id)
    )

    if new_live_project:
        new_live_project.days_count = 1

    return new_live_project
# =========================================================
# GET SINGLE LIVE PROJECT
# =========================================================

async def get_single_live_project(
    db: AsyncSession,
    slug: str,
):

    live_project = await db.scalar(
        select(LiveProject)
        .options(
            selectinload(LiveProject.user)
        )
        .where(
            LiveProject.slug == slug
        )
    )

    if not live_project:
        raise HTTPException(
            status_code=404,
            detail="Live project not found",
        )

    await db.execute(
        update(LiveProject)
        .where(
            LiveProject.id == live_project.id
        )
        .values(
            views_count=LiveProject.views_count + 1
        )
    )

    await db.commit()

    live_project = await db.scalar(
        select(LiveProject)
        .options(
            selectinload(LiveProject.user)
        )
        .where(
            LiveProject.id == live_project.id
        )
    )

    live_project.days_count = (
        datetime.now(timezone.utc).date()
        - live_project.created_at.date()
    ).days + 1

    return live_project


# =========================================================
# GET LIVE PROJECTS FEED
# =========================================================

async def get_live_projects_feed(
    db: AsyncSession,
):

    result = await db.scalars(

        select(LiveProject)

        .options(
            selectinload(LiveProject.user)
        )

        .where(
            LiveProject.is_public == True
        )

        .order_by(
            LiveProject.created_at.desc()
        )

    )

    projects = result.all()

    for project in projects:

        project.days_count = (

            datetime.now(timezone.utc).date()

            -

            project.created_at.date()

        ).days + 1

    return projects


# =========================================================
# UPDATE LIVE PROJECT
# =========================================================

async def update_live_project(
    db: AsyncSession,
    slug: str,
    clerk_user_id: str,
    data: UpdateLiveProject,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    live_project = await db.scalar(
        select(LiveProject)
        .options(
            selectinload(LiveProject.user)
        )
        .where(
            LiveProject.slug == slug,
            LiveProject.user_id == user.id,
        )
    )

    if not live_project:
        raise HTTPException(
            status_code=404,
            detail="Live project not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    if "slug" in update_data and update_data["slug"]:
        new_slug = update_data["slug"].strip().lower()

        existing_slug = await db.scalar(
            select(LiveProject).where(
                LiveProject.user_id == user.id,
                LiveProject.slug == new_slug,
                LiveProject.id != live_project.id,
            )
        )

        if existing_slug:
            raise HTTPException(
                status_code=409,
                detail="Slug already exists",
            )

        update_data["slug"] = new_slug

    if "github_url" in update_data and update_data["github_url"]:
        verified_github_url, github_data, detected_stack = await fetch_github_url(
            update_data["github_url"]
        )

        update_data["github_url"] = verified_github_url

        if "tech_stack" not in update_data:
            update_data["tech_stack"] = detected_stack

    for field, value in update_data.items():
        setattr(
            live_project,
            field,
            value,
        )

    await db.commit()

    live_project = await db.scalar(
        select(LiveProject)
        .options(
            selectinload(LiveProject.user)
        )
        .where(
            LiveProject.id == live_project.id
        )
    )

    return live_project


# =========================================================
# DELETE LIVE PROJECT
# =========================================================

async def delete_live_project(
    db: AsyncSession,
    slug: str,
    clerk_user_id: str,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    live_project = await db.scalar(
        select(LiveProject).where(
            LiveProject.slug == slug,
            LiveProject.user_id == user.id,
        )
    )

    if not live_project:
        raise HTTPException(
            status_code=404,
            detail="Live project not found",
        )

    await db.delete(live_project)

    await db.commit()

    return {
        "message": "Live project deleted successfully"
    }


# =========================================================
# CREATE JOURNAL ENTRY
# =========================================================

async def create_live_project_journal(
    db: AsyncSession,
    slug: str,
    clerk_user_id: str,
    data: CreateLiveProjectJournal,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    live_project = await db.scalar(
        select(LiveProject).where(
            LiveProject.slug == slug,
            LiveProject.user_id == user.id,
        )
    )

    if not live_project:
        raise HTTPException(
            status_code=404,
            detail="Live project not found",
        )

    today = datetime.now(timezone.utc).date()
    created_date = live_project.created_at.date()

    calculated_day_number = (
        today - created_date
    ).days + 1

    new_journal = LiveProjectJournal(
        live_project_id=live_project.id,
        user_id=user.id,
        day_number=calculated_day_number,
        content=data.content,
        entry_type=data.entry_type,
        media_urls=data.media_urls,
        code_snippets=data.code_snippets,
        problem_solutions=[
            item.model_dump()
            for item in data.problem_solutions
        ],
        progress_percentage=data.progress_percentage,
    )

    db.add(new_journal)

    await db.execute(
        update(LiveProject)
        .where(
            LiveProject.id == live_project.id
        )
        .values(
            journal_count=LiveProject.journal_count + 1
        )
    )

    await db.flush()

    await create_feed_event(

        db=db,

        user_id=user.id,

        live_project_id=live_project.id,

        event_type="journal_published",

        content=data.content[:240],

        event_metadata={

            "journal_id":
                str(new_journal.id),

            "entry_type":
                data.entry_type,

            "progress_percentage":
                data.progress_percentage,

        },

    )

    await db.commit()

    await db.refresh(new_journal)

    return new_journal


# =========================================================
# GET LIVE PROJECT JOURNALS
# =========================================================

async def get_live_project_journals(
    db: AsyncSession,
    slug: str,
):

    live_project = await db.scalar(
        select(LiveProject).where(
            LiveProject.slug == slug
        )
    )

    if not live_project:
        raise HTTPException(
            status_code=404,
            detail="Live project not found",
        )

    journals = await db.scalars(
        select(LiveProjectJournal)
        .where(
            LiveProjectJournal.live_project_id == live_project.id
        )
        .order_by(
            LiveProjectJournal.created_at.desc()
        )
    )

    return journals.all()


# =========================================================
# UPDATE JOURNAL ENTRY
# =========================================================

async def update_live_project_journal(
    db: AsyncSession,
    journal_id: UUID,
    clerk_user_id: str,
    data: UpdateLiveProjectJournal,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    journal = await db.scalar(
        select(LiveProjectJournal).where(
            LiveProjectJournal.id == journal_id,
            LiveProjectJournal.user_id == user.id,
        )
    )

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    if "problem_solutions" in update_data and update_data["problem_solutions"]:
        update_data["problem_solutions"] = [
            item.model_dump()
            for item in data.problem_solutions
        ]

    for field, value in update_data.items():
        setattr(
            journal,
            field,
            value,
        )

    await db.commit()

    await db.refresh(journal)

    return journal


# =========================================================
# DELETE JOURNAL ENTRY
# =========================================================

async def delete_live_project_journal(
    db: AsyncSession,
    journal_id: UUID,
    clerk_user_id: str,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    journal = await db.scalar(
        select(LiveProjectJournal).where(
            LiveProjectJournal.id == journal_id,
            LiveProjectJournal.user_id == user.id,
        )
    )

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found",
        )

    live_project_id = journal.live_project_id

    await db.delete(journal)

    await db.execute(
        update(LiveProject)
        .where(
            LiveProject.id == live_project_id,
            LiveProject.journal_count > 0,
        )
        .values(
            journal_count=LiveProject.journal_count - 1
        )
    )

    await db.commit()

    return {
        "message": "Journal deleted successfully"
    }


# =========================================================
# CREATE JOURNAL COMMENT
# =========================================================

async def create_live_project_journal_comment(
    db: AsyncSession,
    journal_id: UUID,
    clerk_user_id: str,
    data: CreateLiveProjectJournalComment,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    journal = await db.scalar(
        select(LiveProjectJournal).where(
            LiveProjectJournal.id == journal_id
        )
    )

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found",
        )

    if data.parent_id:
        parent_comment = await db.scalar(
            select(LiveProjectJournalComment).where(
                LiveProjectJournalComment.id == data.parent_id
            )
        )

        if not parent_comment:
            raise HTTPException(
                status_code=404,
                detail="Parent comment not found",
            )

        if parent_comment.journal_id != journal.id:
            raise HTTPException(
                status_code=400,
                detail="Parent comment does not belong to this journal",
            )

        if parent_comment.parent_id is not None:
            raise HTTPException(
                status_code=400,
                detail="Nested replies are not allowed",
            )

    new_comment = LiveProjectJournalComment(
        user_id=user.id,
        journal_id=journal.id,
        parent_id=data.parent_id,
        content=data.content,
    )

    db.add(new_comment)

    await db.execute(
        update(LiveProjectJournal)
        .where(
            LiveProjectJournal.id == journal.id
        )
        .values(
            comments_count=LiveProjectJournal.comments_count + 1
        )
    )

    await db.commit()

    await db.refresh(new_comment)

    return new_comment


# =========================================================
# UPDATE JOURNAL COMMENT
# =========================================================

async def update_live_project_journal_comment(
    db: AsyncSession,
    comment_id: UUID,
    clerk_user_id: str,
    data: UpdateLiveProjectJournalComment,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    comment = await db.scalar(
        select(LiveProjectJournalComment).where(
            LiveProjectJournalComment.id == comment_id,
            LiveProjectJournalComment.user_id == user.id,
            LiveProjectJournalComment.deleted_at.is_(None),
        )
    )

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found",
        )

    comment.content = data.content
    comment.is_edited = True

    await db.commit()

    await db.refresh(comment)

    return comment


# =========================================================
# SOFT DELETE JOURNAL COMMENT
# =========================================================

async def delete_live_project_journal_comment(
    db: AsyncSession,
    comment_id: UUID,
    clerk_user_id: str,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    comment = await db.scalar(
        select(LiveProjectJournalComment).where(
            LiveProjectJournalComment.id == comment_id,
            LiveProjectJournalComment.user_id == user.id,
            LiveProjectJournalComment.deleted_at.is_(None),
        )
    )

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found",
        )

    comment.content = "[deleted]"
    comment.deleted_at = datetime.now(timezone.utc)

    await db.execute(
        update(LiveProjectJournal)
        .where(
            LiveProjectJournal.id == comment.journal_id,
            LiveProjectJournal.comments_count > 0,
        )
        .values(
            comments_count=LiveProjectJournal.comments_count - 1
        )
    )

    await db.commit()

    return {
        "message": "Comment deleted successfully"
    }


# =========================================================
# GET JOURNAL COMMENTS
# =========================================================

async def get_live_project_journal_comments(
    db: AsyncSession,
    journal_id: UUID,
):

    comments = await db.scalars(
        select(LiveProjectJournalComment)
        .options(
            selectinload(LiveProjectJournalComment.user),
            selectinload(LiveProjectJournalComment.replies),
        )
        .where(
            LiveProjectJournalComment.journal_id == journal_id,
            LiveProjectJournalComment.parent_id.is_(None),
        )
        .order_by(
            LiveProjectJournalComment.created_at.asc()
        )
    )

    return comments.all()


# =========================================================
# LIKE JOURNAL
# =========================================================

async def like_live_project_journal(
    db: AsyncSession,
    journal_id: UUID,
    clerk_user_id: str,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    journal = await db.scalar(
        select(LiveProjectJournal).where(
            LiveProjectJournal.id == journal_id
        )
    )

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found",
        )

    existing_like = await db.scalar(
        select(LiveProjectJournalLike).where(
            LiveProjectJournalLike.user_id == user.id,
            LiveProjectJournalLike.journal_id == journal.id,
        )
    )

    if existing_like:
        raise HTTPException(
            status_code=409,
            detail="Already liked",
        )

    new_like = LiveProjectJournalLike(
        user_id=user.id,
        journal_id=journal.id,
    )

    db.add(new_like)

    await db.execute(
        update(LiveProjectJournal)
        .where(
            LiveProjectJournal.id == journal.id
        )
        .values(
            likes_count=LiveProjectJournal.likes_count + 1
        )
    )

    await db.commit()

    updated_likes_count = await db.scalar(
        select(LiveProjectJournal.likes_count).where(
            LiveProjectJournal.id == journal.id
        )
    )

    return {
        "message": "Journal liked successfully",
        "likes_count": updated_likes_count,
        "is_liked": True,
    }


# =========================================================
# UNLIKE JOURNAL
# =========================================================

async def unlike_live_project_journal(
    db: AsyncSession,
    journal_id: UUID,
    clerk_user_id: str,
):

    user = await get_user_by_clerk_id(
        db=db,
        clerk_user_id=clerk_user_id,
    )

    like = await db.scalar(
        select(LiveProjectJournalLike).where(
            LiveProjectJournalLike.user_id == user.id,
            LiveProjectJournalLike.journal_id == journal_id,
        )
    )

    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found",
        )

    await db.delete(like)

    await db.execute(
        update(LiveProjectJournal)
        .where(
            LiveProjectJournal.id == journal_id,
            LiveProjectJournal.likes_count > 0,
        )
        .values(
            likes_count=LiveProjectJournal.likes_count - 1
        )
    )

    await db.commit()

    updated_likes_count = await db.scalar(
        select(LiveProjectJournal.likes_count).where(
            LiveProjectJournal.id == journal_id
        )
    )

    return {
        "message": "Journal unliked successfully",
        "likes_count": updated_likes_count,
        "is_liked": False,
    }



async def create_feed_event(
    db: AsyncSession,

    user_id: UUID,

    event_type: str,

    content: str | None = None,

    live_project_id: UUID | None = None,

    event_metadata: dict | None = None,

):

    new_event = FeedEvent(

        user_id=user_id,

        live_project_id=live_project_id,

        event_type=event_type,

        content=content,

        event_metadata=event_metadata or {},

    )

    db.add(new_event)

    return new_event


async def get_feed_events(
    db: AsyncSession,
):
    result = await db.scalars(
        select(FeedEvent)
        .options(
            selectinload(FeedEvent.user),
            selectinload(FeedEvent.live_project),
        )
        .where(FeedEvent.is_public == True)
        .order_by(FeedEvent.created_at.desc())
        .limit(50)
    )

    return result.all()