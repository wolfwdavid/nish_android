from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.project import Project
from app.models.changelog import Changelog
from app.models.app_notice import AppNotice

from app.schema.admin import (
    AdminUpdateFeedback,
    AdminUpdateProject,
    AdminUpdateSupportTicket,
    AdminUpdateUser,

    AdminCreateAppNotice,
    AdminUpdateAppNotice,
)
from app.models.feedback import (
    Feedback,
    FeedbackStatus,
)

from app.models.support import (
    SupportTicket,
    TicketStatus,
)

from app.models.LiveProject import LiveProject

from app.schema.admin import (
    AdminUpdateFeedback,
    AdminUpdateProject,
    AdminUpdateSupportTicket,
    AdminUpdateUser,

    AdminCreateChangelog , 
    AdminUpdateChangelog
)



def make_slug(value: str) -> str:
    slug = value.lower().strip()

    cleaned = []

    previous_dash = False

    for char in slug:
        if char.isalnum():
            cleaned.append(char)
            previous_dash = False

        elif char in [" ", "-", "_"]:
            if not previous_dash:
                cleaned.append("-")
                previous_dash = True

    return "".join(cleaned).strip("-")

class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db


    # =========================================================
    # DASHBOARD
    # =========================================================

    async def get_dashboard(self):
        total_users = await self._count(User)
        total_projects = await self._count(Project)
        total_live_projects = await self._count(LiveProject)

        new_feedback_result = await self.db.execute(
            select(func.count(Feedback.id)).where(
                Feedback.status == FeedbackStatus.new
            )
        )

        open_tickets_result = await self.db.execute(
            select(func.count(SupportTicket.id)).where(
                SupportTicket.status.in_(
                    [
                        TicketStatus.open,
                        TicketStatus.in_progress,
                        TicketStatus.waiting_on_user,
                    ]
                )
            )
        )

        active_users_result = await self.db.execute(
            select(func.count(User.id)).where(
                User.is_active == True
            )
        )

        recent_users_result = await self.db.execute(
            select(User)
            .order_by(User.created_at.desc())
            .limit(8)
        )

        recent_projects_result = await self.db.execute(
            select(Project)
            .order_by(Project.created_at.desc())
            .limit(8)
        )

        return {
            "stats": {
                "total_users": total_users,
                "total_projects": total_projects,
                "total_live_projects": total_live_projects,
                "new_feedback": new_feedback_result.scalar_one(),
                "open_support_tickets": open_tickets_result.scalar_one(),
                "active_users": active_users_result.scalar_one(),
            },
            "recent_users": recent_users_result.scalars().all(),
            "recent_projects": recent_projects_result.scalars().all(),
        }


    async def _count(self, model):
        result = await self.db.execute(
            select(func.count(model.id))
        )

        return result.scalar_one()


    # =========================================================
    # FEEDBACK
    # =========================================================

    async def list_feedback(
        self,
        status_filter: str | None = None,
        limit: int = 50,
    ):
        query = select(Feedback).order_by(
            Feedback.created_at.desc()
        )

        if status_filter:
            query = query.where(
                Feedback.status == status_filter
            )

        result = await self.db.execute(
            query.limit(limit)
        )

        return result.scalars().all()


    async def update_feedback(
        self,
        feedback_id: UUID,
        payload: AdminUpdateFeedback,
    ):
        feedback = await self.db.get(
            Feedback,
            feedback_id,
        )

        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(feedback, key, value)

        await self.db.commit()
        await self.db.refresh(feedback)

        return feedback


    # =========================================================
    # SUPPORT
    # =========================================================

    async def list_support_tickets(
        self,
        status_filter: str | None = None,
        limit: int = 50,
    ):
        query = select(SupportTicket).order_by(
            SupportTicket.created_at.desc()
        )

        if status_filter:
            query = query.where(
                SupportTicket.status == status_filter
            )

        result = await self.db.execute(
            query.limit(limit)
        )

        return result.scalars().all()


    async def update_support_ticket(
        self,
        ticket_id: UUID,
        payload: AdminUpdateSupportTicket,
    ):
        ticket = await self.db.get(
            SupportTicket,
            ticket_id,
        )

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(ticket, key, value)

        await self.db.commit()
        await self.db.refresh(ticket)

        return ticket


    # =========================================================
    # USERS
    # =========================================================

    async def list_users(
        self,
        limit: int = 50,
    ):
        result = await self.db.execute(
            select(User)
            .order_by(User.created_at.desc())
            .limit(limit)
        )

        return result.scalars().all()


    async def update_user(
        self,
        user_id: UUID,
        payload: AdminUpdateUser,
    ):
        user = await self.db.get(
            User,
            user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)

        return user


    # =========================================================
    # PROJECTS
    # =========================================================

    async def list_projects(
        self,
        limit: int = 50,
    ):
        result = await self.db.execute(
            select(Project)
            .order_by(Project.created_at.desc())
            .limit(limit)
        )

        return result.scalars().all()


    async def update_project(
        self,
        project_id: UUID,
        payload: AdminUpdateProject,
    ):
        project = await self.db.get(
            Project,
            project_id,
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(project, key, value)

        await self.db.commit()
        await self.db.refresh(project)

        return project
    

    # =========================================================
    # CHANGELOGS
    # =========================================================

    async def ensure_unique_changelog_slug(
        self,
        base_slug: str,
        current_id: UUID | None = None,
    ) -> str:
        slug = base_slug
        counter = 1

        while True:
            query = select(Changelog).where(
                Changelog.slug == slug
            )

            if current_id is not None:
                query = query.where(
                    Changelog.id != current_id
                )

            result = await self.db.execute(query)

            existing = result.scalar_one_or_none()

            if existing is None:
                return slug

            slug = f"{base_slug}-{counter}"
            counter += 1


    async def list_changelogs(
        self,
        limit: int = 50,
    ):
        result = await self.db.execute(
            select(Changelog)
            .order_by(
                Changelog.created_at.desc()
            )
            .limit(limit)
        )

        return result.scalars().all()


    async def create_changelog(
        self,
        payload: AdminCreateChangelog,
    ):
        base_slug = make_slug(
            payload.slug or payload.title
        )

        if not base_slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid changelog slug",
            )

        final_slug = await self.ensure_unique_changelog_slug(
            base_slug=base_slug,
        )

        published_at = None

        if payload.is_published:
            published_at = datetime.now(timezone.utc)

        changelog = Changelog(
            title=payload.title,
            slug=final_slug,
            version=payload.version,
            summary=payload.summary,
            content=payload.content,
            changelog_type=payload.changelog_type,
            tags=payload.tags,
            is_published=payload.is_published,
            published_at=published_at,
        )

        self.db.add(changelog)

        await self.db.commit()

        await self.db.refresh(changelog)

        return changelog


    async def update_changelog(
        self,
        changelog_id: UUID,
        payload: AdminUpdateChangelog,
    ):
        changelog = await self.db.get(
            Changelog,
            changelog_id,
        )

        if not changelog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Changelog not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        if "slug" in update_data and update_data["slug"]:
            base_slug = make_slug(
                update_data["slug"]
            )

            if not base_slug:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid changelog slug",
                )

            update_data["slug"] = await self.ensure_unique_changelog_slug(
                base_slug=base_slug,
                current_id=changelog.id,
            )

        was_unpublished = changelog.is_published is False

        for key, value in update_data.items():
            setattr(changelog, key, value)

        if (
            "is_published" in update_data
            and update_data["is_published"] is True
            and was_unpublished
        ):
            changelog.published_at = datetime.now(timezone.utc)

        if (
            "is_published" in update_data
            and update_data["is_published"] is False
        ):
            changelog.published_at = None

        await self.db.commit()

        await self.db.refresh(changelog)

        return changelog


    async def delete_changelog(
        self,
        changelog_id: UUID,
    ):
        changelog = await self.db.get(
            Changelog,
            changelog_id,
        )

        if not changelog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Changelog not found",
            )

        await self.db.delete(changelog)

        await self.db.commit()

        return {
            "message": "Changelog deleted successfully"
        }
    

    # =========================================================
    # APP NOTICES
    # =========================================================

    async def list_app_notices(
        self,
        limit: int = 50,
    ):
        result = await self.db.execute(
            select(AppNotice)
            .order_by(
                AppNotice.priority.desc(),
                AppNotice.created_at.desc(),
            )
            .limit(limit)
        )

        return result.scalars().all()


    async def create_app_notice(
        self,
        payload: AdminCreateAppNotice,
    ):
        notice = AppNotice(
            title=payload.title,
            message=payload.message,
            notice_type=payload.notice_type,
            cta_label=payload.cta_label,
            cta_href=payload.cta_href,
            is_active=payload.is_active,
            show_once=payload.show_once,
            priority=payload.priority,
            starts_at=payload.starts_at,
            expires_at=payload.expires_at,
        )

        self.db.add(notice)

        await self.db.commit()

        await self.db.refresh(notice)

        return notice


    async def update_app_notice(
        self,
        notice_id: UUID,
        payload: AdminUpdateAppNotice,
    ):
        notice = await self.db.get(
            AppNotice,
            notice_id,
        )

        if not notice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="App notice not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(notice, key, value)

        await self.db.commit()

        await self.db.refresh(notice)

        return notice


    async def delete_app_notice(
        self,
        notice_id: UUID,
    ):
        notice = await self.db.get(
            AppNotice,
            notice_id,
        )

        if not notice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="App notice not found",
            )

        await self.db.delete(notice)

        await self.db.commit()

        return {
            "message": "App notice deleted successfully"
        }