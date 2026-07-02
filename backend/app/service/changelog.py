from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.changelog import Changelog
from app.schema.changelog import (
    CreateChangelog,
    UpdateChangelog,
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


async def ensure_unique_slug(
    db: AsyncSession,
    base_slug: str,
    current_id: UUID | None = None,
) -> str:
    slug = base_slug
    counter = 1

    while True:
        stmt = select(Changelog).where(
            Changelog.slug == slug
        )

        if current_id is not None:
            stmt = stmt.where(
                Changelog.id != current_id
            )

        result = await db.execute(stmt)

        existing = result.scalar_one_or_none()

        if existing is None:
            return slug

        slug = f"{base_slug}-{counter}"
        counter += 1


async def create_changelog(
    db: AsyncSession,
    data: CreateChangelog,
) -> Changelog:
    base_slug = make_slug(
        data.slug or data.title
    )

    if not base_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid changelog slug",
        )

    final_slug = await ensure_unique_slug(
        db=db,
        base_slug=base_slug,
    )

    published_at = None

    if data.is_published:
        published_at = datetime.now(timezone.utc)

    changelog = Changelog(
        title=data.title,
        slug=final_slug,
        version=data.version,
        summary=data.summary,
        content=data.content,
        changelog_type=data.changelog_type,
        tags=data.tags,
        is_published=data.is_published,
        published_at=published_at,
    )

    db.add(changelog)

    await db.commit()

    await db.refresh(changelog)

    return changelog


async def get_changelogs(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    published_only: bool = True,
):
    stmt = select(Changelog)

    count_stmt = select(
        func.count(Changelog.id)
    )

    if published_only:
        stmt = stmt.where(
            Changelog.is_published == True
        )

        count_stmt = count_stmt.where(
            Changelog.is_published == True
        )

    stmt = (
        stmt.order_by(
            Changelog.published_at.desc().nullslast(),
            Changelog.created_at.desc(),
        )
        .limit(limit)
        .offset(offset)
    )

    result = await db.execute(stmt)

    total_result = await db.execute(count_stmt)

    return {
        "items": result.scalars().all(),
        "total": total_result.scalar_one(),
        "limit": limit,
        "offset": offset,
    }


async def get_changelog_by_slug(
    db: AsyncSession,
    slug: str,
    published_only: bool = True,
) -> Changelog:
    stmt = select(Changelog).where(
        Changelog.slug == slug
    )

    if published_only:
        stmt = stmt.where(
            Changelog.is_published == True
        )

    result = await db.execute(stmt)

    changelog = result.scalar_one_or_none()

    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Changelog not found",
        )

    return changelog


async def update_changelog(
    db: AsyncSession,
    changelog_id: UUID,
    data: UpdateChangelog,
) -> Changelog:
    result = await db.execute(
        select(Changelog).where(
            Changelog.id == changelog_id
        )
    )

    changelog = result.scalar_one_or_none()

    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Changelog not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    if "slug" in update_data and update_data["slug"]:
        base_slug = make_slug(update_data["slug"])

        update_data["slug"] = await ensure_unique_slug(
            db=db,
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

    await db.commit()

    await db.refresh(changelog)

    return changelog


async def delete_changelog(
    db: AsyncSession,
    changelog_id: UUID,
) -> dict:
    result = await db.execute(
        select(Changelog).where(
            Changelog.id == changelog_id
        )
    )

    changelog = result.scalar_one_or_none()

    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Changelog not found",
        )

    await db.delete(changelog)

    await db.commit()

    return {
        "message": "Changelog deleted successfully"
    }