from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.LiveProject import FeedEvent


async def get_dashboard_data(
    db: AsyncSession,
    clerk_user_id: str,
):
    user = await db.scalar(
        select(User)
        .where(User.clerk_user_id == clerk_user_id)
        .options(
            selectinload(User.projects),
            selectinload(User.live_projects),
            selectinload(User.stack_stats),
        )
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    projects = sorted(
        user.projects,
        key=lambda project: project.created_at,
        reverse=True,
    )

    live_projects = sorted(
        user.live_projects,
        key=lambda project: project.created_at,
        reverse=True,
    )

    stack_stats = sorted(
        user.stack_stats,
        key=lambda stack: getattr(stack, "score", 0),
        reverse=True,
    )

    recent_activity = await db.scalars(
        select(FeedEvent)
        .where(FeedEvent.user_id == user.id)
        .order_by(FeedEvent.created_at.desc())
        .limit(10)
    )

    recent_activity = recent_activity.all()

    total_views = sum(
        project.views_count
        for project in projects
    ) + sum(
        project.views_count
        for project in live_projects
    )

    total_stars = sum(
        project.stars_count
        for project in projects
    )

    total_comments = sum(
        project.comments_count
        for project in projects
    )

    total_journals = sum(
        project.journal_count
        for project in live_projects
    )

    return {
        "username": user.username,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,

        "stats": {
            "total_projects": len(projects),
            "total_live_projects": len(live_projects),
            "total_views": total_views,
            "total_stars": total_stars,
            "total_comments": total_comments,
            "total_journals": total_journals,
        },

        "recent_projects": projects[:5],
        "active_live_projects": live_projects[:5],
        "top_stacks": stack_stats[:8],
        "recent_activity": recent_activity,
    }