from datetime import datetime, timezone
from typing import Any, Optional
from uuid import UUID

from fastapi import HTTPException, status

from sqlalchemy import select, func, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

from app.models.feedback import (
    Feedback,
    FeedbackType,
    FeedbackStatus,
    FeedbackSentiment,
)

from app.schema.feedback import (
    FeedbackCreate,
    FeedbackAdminUpdate,
)


class FeedbackService:

    def __init__(
        self,
        db: AsyncSession,
    ):
        self.db = db


    # =========================================================
    # USER HELPER
    # =========================================================

    async def get_user_by_clerk_user_id(
        self,
        clerk_user_id: str,
    ) -> User:

        result = await self.db.execute(
            select(User).where(
                User.clerk_user_id == clerk_user_id
            )
        )

        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return user


    # =========================================================
    # CREATE FEEDBACK
    # =========================================================

    async def create_feedback(
        self,
        payload: FeedbackCreate,
        clerk_user_id: Optional[str] = None,
        request_diagnostics: Optional[dict[str, Any]] = None,
    ) -> Feedback:

        user: Optional[User] = None

        if clerk_user_id:
            user = await self.get_user_by_clerk_user_id(
                clerk_user_id=clerk_user_id,
            )

        diagnostics: Optional[dict[str, Any]] = None

        if payload.diagnostics or request_diagnostics:
            diagnostics = {
                **(payload.diagnostics or {}),
                **(request_diagnostics or {}),
            }

        feedback = Feedback(
            user_id=user.id if user else None,
            feedback_type=payload.feedback_type,
            status=FeedbackStatus.new,
            sentiment=self._infer_sentiment(
                rating=payload.rating,
                feedback_type=payload.feedback_type,
                message=payload.message,
            ),
            rating=payload.rating,
            title=payload.title.strip(),
            message=payload.message.strip(),
            page_url=payload.page_url,
            source=payload.source or "feedback_page",
            allow_contact=payload.allow_contact,
            contact_email=payload.contact_email if payload.allow_contact else None,
            diagnostics=diagnostics,
        )

        self.db.add(feedback)

        await self.db.commit()
        await self.db.refresh(feedback)

        return feedback


    # =========================================================
    # LIST MY FEEDBACK
    # Optional, but useful later.
    # =========================================================

    async def list_my_feedback(
        self,
        clerk_user_id: str,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Feedback], int]:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        limit = min(
            max(limit, 1),
            100,
        )

        offset = max(
            offset,
            0,
        )

        filters = [
            Feedback.user_id == user.id
        ]

        items_query = (
            select(Feedback)
            .where(*filters)
            .order_by(
                Feedback.created_at.desc()
            )
            .limit(limit)
            .offset(offset)
        )

        count_query = (
            select(func.count(Feedback.id))
            .where(*filters)
        )

        items_result = await self.db.execute(items_query)
        count_result = await self.db.execute(count_query)

        return (
            list(items_result.scalars().all()),
            count_result.scalar_one(),
        )


    # =========================================================
    # GET MY SINGLE FEEDBACK
    # =========================================================

    async def get_my_feedback(
        self,
        clerk_user_id: str,
        feedback_id: UUID,
    ) -> Feedback:

        user = await self.get_user_by_clerk_user_id(
            clerk_user_id=clerk_user_id,
        )

        result = await self.db.execute(
            select(Feedback).where(
                Feedback.id == feedback_id,
                Feedback.user_id == user.id,
            )
        )

        feedback = result.scalar_one_or_none()

        if feedback is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found.",
            )

        return feedback


    # =========================================================
    # ADMIN LIST FEEDBACK
    # Protect with admin auth later.
    # =========================================================

    async def admin_list_feedback(
        self,
        feedback_status: Optional[FeedbackStatus] = None,
        feedback_type: Optional[FeedbackType] = None,
        sentiment: Optional[FeedbackSentiment] = None,
        rating: Optional[int] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Feedback], int]:

        limit = min(
            max(limit, 1),
            100,
        )

        offset = max(
            offset,
            0,
        )

        filters = []

        if feedback_status is not None:
            filters.append(
                Feedback.status == feedback_status
            )

        if feedback_type is not None:
            filters.append(
                Feedback.feedback_type == feedback_type
            )

        if sentiment is not None:
            filters.append(
                Feedback.sentiment == sentiment
            )

        if rating is not None:
            filters.append(
                Feedback.rating == rating
            )

        status_rank = case(
            (
                Feedback.status == FeedbackStatus.new,
                1,
            ),
            (
                Feedback.status == FeedbackStatus.reviewed,
                2,
            ),
            (
                Feedback.status == FeedbackStatus.planned,
                3,
            ),
            (
                Feedback.status == FeedbackStatus.shipped,
                4,
            ),
            else_=5,
        )

        sentiment_rank = case(
            (
                Feedback.sentiment == FeedbackSentiment.negative,
                1,
            ),
            (
                Feedback.sentiment == FeedbackSentiment.neutral,
                2,
            ),
            (
                Feedback.sentiment == FeedbackSentiment.positive,
                3,
            ),
            else_=4,
        )

        items_query = (
            select(Feedback)
            .where(*filters)
            .order_by(
                status_rank.asc(),
                sentiment_rank.asc(),
                Feedback.created_at.desc(),
            )
            .limit(limit)
            .offset(offset)
        )

        count_query = (
            select(func.count(Feedback.id))
            .where(*filters)
        )

        items_result = await self.db.execute(items_query)
        count_result = await self.db.execute(count_query)

        return (
            list(items_result.scalars().all()),
            count_result.scalar_one(),
        )


    # =========================================================
    # ADMIN GET SINGLE FEEDBACK
    # =========================================================

    async def admin_get_feedback(
        self,
        feedback_id: UUID,
    ) -> Feedback:

        result = await self.db.execute(
            select(Feedback).where(
                Feedback.id == feedback_id
            )
        )

        feedback = result.scalar_one_or_none()

        if feedback is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found.",
            )

        return feedback


    # =========================================================
    # ADMIN UPDATE FEEDBACK
    # Protect with admin auth later.
    # =========================================================

    async def admin_update_feedback(
        self,
        feedback_id: UUID,
        payload: FeedbackAdminUpdate,
        admin_clerk_user_id: Optional[str] = None,
    ) -> Feedback:

        feedback = await self.admin_get_feedback(
            feedback_id=feedback_id,
        )

        admin: Optional[User] = None

        if admin_clerk_user_id:
            admin = await self.get_user_by_clerk_user_id(
                clerk_user_id=admin_clerk_user_id,
            )

        data = payload.model_dump(
            exclude_unset=True,
        )

        old_status = feedback.status
        new_status = data.get("status")

        for field, value in data.items():
            setattr(feedback, field, value)

        if new_status is not None and new_status != old_status:
            if new_status in (
                FeedbackStatus.reviewed,
                FeedbackStatus.planned,
                FeedbackStatus.shipped,
                FeedbackStatus.archived,
            ):
                feedback.reviewed_at = datetime.now(timezone.utc)

                if admin:
                    feedback.reviewed_by_user_id = admin.id

        await self.db.commit()
        await self.db.refresh(feedback)

        return feedback


    # =========================================================
    # ADMIN ARCHIVE FEEDBACK
    # =========================================================

    async def admin_archive_feedback(
        self,
        feedback_id: UUID,
        admin_clerk_user_id: Optional[str] = None,
    ) -> Feedback:

        feedback = await self.admin_get_feedback(
            feedback_id=feedback_id,
        )

        admin: Optional[User] = None

        if admin_clerk_user_id:
            admin = await self.get_user_by_clerk_user_id(
                clerk_user_id=admin_clerk_user_id,
            )

        feedback.status = FeedbackStatus.archived
        feedback.reviewed_at = datetime.now(timezone.utc)

        if admin:
            feedback.reviewed_by_user_id = admin.id

        await self.db.commit()
        await self.db.refresh(feedback)

        return feedback


    # =========================================================
    # INTERNAL HELPERS
    # =========================================================

    def _infer_sentiment(
        self,
        rating: Optional[int],
        feedback_type: FeedbackType,
        message: str,
    ) -> FeedbackSentiment:

        if rating is not None:
            if rating >= 4:
                return FeedbackSentiment.positive

            if rating <= 2:
                return FeedbackSentiment.negative

            return FeedbackSentiment.neutral

        if feedback_type == FeedbackType.praise:
            return FeedbackSentiment.positive

        if feedback_type == FeedbackType.complaint:
            return FeedbackSentiment.negative

        negative_words = [
            "bad",
            "broken",
            "hate",
            "confusing",
            "annoying",
            "slow",
            "ugly",
            "crash",
            "bug",
            "error",
            "failed",
            "trash",
        ]

        normalized = message.lower()

        if any(word in normalized for word in negative_words):
            return FeedbackSentiment.negative

        return FeedbackSentiment.neutral