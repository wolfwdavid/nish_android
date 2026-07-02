from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.changelog import (
    CreateChangelog,
    UpdateChangelog,
    GetChangelog,
    ChangelogListResponse,
)

from app.service.changelog import (
    create_changelog,
    get_changelogs,
    get_changelog_by_slug,
    update_changelog,
    delete_changelog,
)


router = APIRouter(
    prefix="/changelog",
    tags=["Changelog"],
)


# =========================================================
# CREATE CHANGELOG
# Admin-only later
# =========================================================

@router.post(
    "",
    response_model=GetChangelog,
)
async def create_changelog_route(
    data: CreateChangelog,
    db: AsyncSession = Depends(get_db),
):
    return await create_changelog(
        db=db,
        data=data,
    )


# =========================================================
# GET PUBLIC CHANGELOGS
# =========================================================

@router.get(
    "",
    response_model=ChangelogListResponse,
)
async def get_changelogs_route(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    db: AsyncSession = Depends(get_db),
):
    result = await get_changelogs(
        db=db,
        limit=limit,
        offset=offset,
        published_only=True,
    )

    return result


# =========================================================
# GET SINGLE PUBLIC CHANGELOG
# =========================================================

@router.get(
    "/{slug}",
    response_model=GetChangelog,
)
async def get_single_changelog_route(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    return await get_changelog_by_slug(
        db=db,
        slug=slug,
        published_only=True,
    )


# =========================================================
# GET ALL CHANGELOGS FOR ADMIN
# Admin-only later
# =========================================================

@router.get(
    "/admin/all",
    response_model=ChangelogListResponse,
)
async def get_admin_changelogs_route(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    db: AsyncSession = Depends(get_db),
):
    result = await get_changelogs(
        db=db,
        limit=limit,
        offset=offset,
        published_only=False,
    )

    return result


# =========================================================
# UPDATE CHANGELOG
# Admin-only later
# =========================================================

@router.patch(
    "/{changelog_id}",
    response_model=GetChangelog,
)
async def update_changelog_route(
    changelog_id: UUID,
    data: UpdateChangelog,
    db: AsyncSession = Depends(get_db),
):
    return await update_changelog(
        db=db,
        changelog_id=changelog_id,
        data=data,
    )


# =========================================================
# DELETE CHANGELOG
# Admin-only later
# =========================================================

@router.delete(
    "/{changelog_id}",
)
async def delete_changelog_route(
    changelog_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await delete_changelog(
        db=db,
        changelog_id=changelog_id,
    )