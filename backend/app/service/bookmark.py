from uuid import UUID

from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.models.project import (
    Project,
    ProjectBookmark,
    ProjectStar,
)


# =========================================================
# ADD PROJECT BOOKMARK
# =========================================================

async def add_project_bookmark(
    db: AsyncSession,
    slug: str,
    user_id: UUID,
):

    project = await db.scalar(
        select(Project).where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    existing_bookmark = await db.scalar(
        select(ProjectBookmark).where(
            ProjectBookmark.user_id == user_id,
            ProjectBookmark.project_id == project.id,
        )
    )

    if existing_bookmark:

        return {
            "project_id": project.id,
            "is_bookmarked": True,
        }

    bookmark = ProjectBookmark(
        user_id=user_id,
        project_id=project.id,
    )

    db.add(bookmark)

    try:

        await db.commit()

    except IntegrityError:

        await db.rollback()

        return {
            "project_id": project.id,
            "is_bookmarked": True,
        }

    return {
        "project_id": project.id,
        "is_bookmarked": True,
    }


# =========================================================
# REMOVE PROJECT BOOKMARK
# =========================================================

async def remove_project_bookmark(
    db: AsyncSession,
    slug: str,
    user_id: UUID,
):

    project = await db.scalar(
        select(Project).where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    existing_bookmark = await db.scalar(
        select(ProjectBookmark).where(
            ProjectBookmark.user_id == user_id,
            ProjectBookmark.project_id == project.id,
        )
    )

    if existing_bookmark:

        await db.delete(existing_bookmark)
        await db.commit()

    return {
        "project_id": project.id,
        "is_bookmarked": False,
    }


# =========================================================
# GET MY BOOKMARKS
# =========================================================

async def get_my_bookmarks(
    db: AsyncSession,
    clerk_user_id: str,
):

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

    bookmarks_result = await db.execute(
        select(ProjectBookmark)
        .options(
            selectinload(
                ProjectBookmark.project
            ).selectinload(
                Project.user
            )
        )
        .where(
            ProjectBookmark.user_id == user.id
        )
        .order_by(
            ProjectBookmark.created_at.desc()
        )
    )

    bookmarks = bookmarks_result.scalars().all()

    project_ids = [
        bookmark.project_id
        for bookmark in bookmarks
    ]

    starred_project_ids = set()

    if project_ids:

        stars_result = await db.execute(
            select(ProjectStar.project_id).where(
                ProjectStar.user_id == user.id,
                ProjectStar.project_id.in_(project_ids),
            )
        )

        starred_project_ids = set(
            stars_result.scalars().all()
        )

    serialized_projects = []

    for bookmark in bookmarks:

        project = bookmark.project

        serialized_projects.append({
            "id": project.id,
            "user_id": project.user_id,

            "title": project.title,
            "slug": project.slug,
            "description": project.description,

            "github_url": project.github_url,
            "live_url": project.live_url,

            "thumbnail_url": project.thumbnail_url,
            "demo_video_url": project.demo_video_url,

            "gallery_urls": project.gallery_urls or [],
            "tech_stack": project.tech_stack or [],

            "stars_count": project.stars_count,
            "views_count": project.views_count,
            "comments_count": project.comments_count,

            "is_featured": project.is_featured,

            "is_starred": project.id in starred_project_ids,
            "is_bookmarked": True,

            "created_at": project.created_at,
            "updated_at": project.updated_at,

            "user": {
                "username": project.user.username,
                "avatar_url": project.user.avatar_url,
                "location": project.user.location,
            },
        })

    return serialized_projects