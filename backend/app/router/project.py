from datetime import datetime
from uuid import UUID
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.project import (
    AnalyzeRepoRequest,
    CreateProject,
    GetProjectBookmark,
    PaginatedProjects,
    UpdateProject,
    GetProject,
    CommentOut,
    GetComment,
    AddComment,
    UpdateComment,
    AddVote,
    ProjectBookmarkStatus,
)

from app.service.project import (
    add_project_bookmark,
    create_new_project,
    delete_existing_project,
    get_existing_project,
    get_projects,
    get_users_all_profile,
    remove_project_bookmark,
    update_existing_project,
    add_project_star,
    remove_project_star,
    add_project_comment,
    update_project_comment,
    delete_project_comment,
    get_project_comments,
    vote_on_comment,
    
    
)
from app.models.user import User
from app.core.auth import get_current_user_optional
from app.schema.ProfileAnalytics import UserFullProfileResponse


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


# =========================================================
# CREATE PROJECT
# =========================================================

@router.post(
    "/",
    response_model=GetProject,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    data: CreateProject,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return await create_new_project(
        db=db,
        data=data,
        user_id=user.id,
    )


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@router.get(
    "/{slug}",
    response_model=GetProject,
)
async def get_project(
    slug: str,
    clerk_user_id : str | None = None ,
    db: AsyncSession = Depends(get_db),
):

    return await get_existing_project(
        db=db,
        slug=slug,
        clerk_user_id=clerk_user_id
    )


# =========================================================
# GET ALL PROJECTS OF A USER
# =========================================================
@router.get(
    "/{username}/full-profile",
    response_model=UserFullProfileResponse,
)
async def get_full_profile(
    username: str,
    db: AsyncSession = Depends(get_db),
):
    return await get_users_all_profile(
        db=db,
        username=username,
    )


# =========================================================
# ANALYZE REPOSITORY
# =========================================================

@router.post("/analyze-repo")
async def analyze_repository(
    data: AnalyzeRepoRequest,
):

    github_url = data.github_url



    # temporary fake response
    # later this becomes:
    # github api analysis
    # language analysis
    # repo scraping
    # ai architecture analysis

    return {

        "repo_name": "Detected Repo",

        "description":
            "Repository analysis connected successfully.",

        "detected_stack": [
            "Next.js",
            "FastAPI",
            "PostgreSQL",
            "Tailwind",
        ],

        "stars": 12,

        "thumbnail_url": "",
    }

# =========================================================
# GET ALL PROJECTS
# =========================================================

@router.get(
    "/",
    response_model=PaginatedProjects,
)
async def fetch_projects(
    limit: int = Query(default=20, le=100),
    cursor: datetime = Query(default=None),

    db: AsyncSession = Depends(get_db),

    current_user: User | None = Depends(
        get_current_user_optional
    ),
):

    return await get_projects(
        db=db,
        limit=limit,
        cursor=cursor,
        current_user=current_user,
    )


# =========================================================
# DELETE PROJECT
# =========================================================

@router.delete(
    "/{slug}",
)
async def delete_project(
    slug: str,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    return await delete_existing_project(
        db=db,
        slug=slug,
        clerk_user_id=clerk_user_id,
    )


# =========================================================
# UPDATE PROJECT
# =========================================================

@router.patch(
    "/{slug}",
    response_model=GetProject,
)
async def update_project(
    slug: str,
    data: UpdateProject,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
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

    return await update_existing_project(
        db=db,
        slug=slug,
        data=data,
        user_id=user.id,
    )


# =========================================================
# STAR PROJECT
# =========================================================

@router.post(
    "/{slug}/star",
    response_model=GetProject,
)
async def star_project(
    slug: str,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
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

    return await add_project_star(
        db=db,
        slug=slug,
        user_id=user.id,
    )


# =========================================================
# UNSTAR PROJECT
# =========================================================

@router.delete(
    "/{slug}/star",
    response_model=GetProject,
)
async def unstar_project(
    slug: str,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
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

    return await remove_project_star(
        db=db,
        slug=slug,
        user_id=user.id,
    )


# =========================================================
# ADD COMMENT
# =========================================================

@router.post(
    "/{slug}/comments",
    response_model=CommentOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    slug: str,
    data: AddComment,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
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

    return await add_project_comment(
        db=db,
        slug=slug,
        data=data,
        user_id=user.id,
    )


# =========================================================
# GET PROJECT COMMENTS
# =========================================================

@router.get(
    "/{slug}/comments",
    response_model=List[GetComment],
)
async def fetch_project_comments(
    slug: str,
    db: AsyncSession = Depends(get_db),
):

    return await get_project_comments(
        db=db,
        slug=slug,
    )


# =========================================================
# UPDATE COMMENT
# =========================================================

@router.patch(
    "/comments/{comment_id}",
    response_model=CommentOut,
)
async def edit_comment(
    comment_id: UUID,
    data: UpdateComment,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    return await update_project_comment(
        db=db,
        comment_id=comment_id,
        data=data,
        clerk_user_id=clerk_user_id,
    )


# =========================================================
# DELETE COMMENT
# =========================================================

@router.delete(
    "/comments/{comment_id}",
)
async def remove_comment(
    comment_id: UUID,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    return await delete_project_comment(
        db=db,
        comment_id=comment_id,
        clerk_user_id=clerk_user_id,
    )


# =========================================================
# VOTE COMMENT
# =========================================================

@router.post(
    "/comments/{comment_id}/vote",
    response_model=CommentOut,
)
async def vote_comment(
    comment_id: UUID,
    data: AddVote,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):

    return await vote_on_comment(
        db=db,
        comment_id=comment_id,
        data=data,
        clerk_user_id=clerk_user_id,
    )


# =========================================================
# ADD BOOKMARK
# =========================================================

@router.post(
    "/{slug}/bookmark",
    response_model=ProjectBookmarkStatus,
)
async def bookmark_project(
    slug: str,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
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

    return await add_project_bookmark(
        db=db,
        slug=slug,
        user_id=user.id,
    )


# =========================================================
# REMOVE BOOKMARK
# =========================================================

@router.delete(
    "/{slug}/bookmark",
    response_model=ProjectBookmarkStatus,
)
async def unbookmark_project(
    slug: str,
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
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

    return await remove_project_bookmark(
        db=db,
        slug=slug,
        user_id=user.id,
    )