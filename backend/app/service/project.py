from datetime import datetime
import uuid

from fastapi import HTTPException , status

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func
from sqlalchemy.orm import selectinload


from app.models.project import (
    Project,
    ProjectBookmark,
    ProjectStar,
    ProjectComment,
    ProjectCommentVote,
)
from app.schema.project import (
    CreateProject,
    UpdateProject,
    AddComment,
    UpdateComment,
    AddVote,
)

from app.utility.project_utility import (
    fetch_github_url,
    verify_live_url,
    generate_unique_slug,
)
from app.models.user import User , UserStackStat




# =========================================================
# HELPERS
# =========================================================

async def _get_project_by_slug(
    db: AsyncSession,
    slug: str,
) -> Project:
    """Fetch a project by slug or raise 404."""

    project = await db.scalar(
        select(Project).where(Project.slug == slug)
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project


async def _get_comment_by_id(
    db: AsyncSession,
    comment_id: uuid.UUID,
) -> ProjectComment:
    """
    Fetch a comment by id or raise 404.
    Excludes soft-deleted rows — a deleted comment is
    treated as if it doesn't exist for editing/voting.
    """

    comment = await db.scalar(
        select(ProjectComment).where(
            ProjectComment.id == comment_id,
            ProjectComment.deleted_at.is_(None),
        )
    )

    if not comment:

        raise HTTPException(
            status_code=404,
            detail="Comment not found",
        )

    return comment


# =========================================================
# CREATE NEW PROJECT
# =========================================================

async def create_new_project(
    db: AsyncSession,
    data: CreateProject,
    user_id: uuid.UUID,
):

    project_title = data.title.strip()

    # Verify external resources BEFORE touching the DB.
    (
        verified_github_url,
        github_data,
        tech_stack,
    ) = await fetch_github_url(
        data.github_url
    )

    verified_live_url = await verify_live_url(
        data.live_url
    )

    # Retry slug generation in case of race collisions.
    for _ in range(5):

        project_slug = await generate_unique_slug(
            db,
            project_title,
            Project,
        )

        project = Project(
            user_id=user_id,
            title=project_title,
            slug=project_slug,
            description=data.description,

            github_url=verified_github_url,
            live_url=verified_live_url,

            thumbnail_url=data.thumbnail_url,
            demo_video_url=data.demo_video_url,

            gallery_urls=data.gallery_urls,

            tech_stack=tech_stack,
            github_data=github_data,
        )

        db.add(project)

        try:

            # Push INSERT without committing yet.
            await db.flush()

            # =========================================
            # UPDATE USER STACK INTELLIGENCE
            # =========================================

            for stack in tech_stack:

                existing_stack = await db.scalar(
                    select(UserStackStat).where(
                        UserStackStat.user_id == user_id,
                        UserStackStat.stack_name == stack,
                    )
                )

                if existing_stack:

                    existing_stack.projects_count += 1

                else:

                    new_stack = UserStackStat(
                        user_id=user_id,
                        stack_name=stack,
                        projects_count=1,
                    )

                    db.add(new_stack)

            # =========================================
            # UPDATE USER PROJECT COUNT
            # =========================================

            user = await db.scalar(
                select(User).where(
                    User.id == user_id
                )
            )

            if user:

                user.project_count += 1

            # =========================================
            # FINAL COMMIT
            # =========================================

            await db.commit()

            await db.refresh(project)

            project = await db.scalar(
                select(Project)
                .options(
                    selectinload(Project.user)
                )
                .where(
                    Project.id == project.id
                )
            )

            return {

                "id": project.id,

                "user_id": project.user_id,

                "title": project.title,

                "slug": project.slug,

                "description": project.description,

                "github_url": project.github_url,

                "live_url": project.live_url,

                "thumbnail_url": project.thumbnail_url,

                "demo_video_url": project.demo_video_url,

                "gallery_urls": project.gallery_urls,

                "tech_stack": project.tech_stack,

                "stars_count": project.stars_count,

                "views_count": project.views_count,

                "comments_count": project.comments_count,

                "is_featured": project.is_featured,

                "is_starred": False,

                "is_bookmarked": False,

                "created_at": project.created_at,

                "updated_at": project.updated_at,

                "user": {

                    "username": project.user.username,

                    "avatar_url": project.user.avatar_url,

                    "location": project.user.location,
                }
            }

        except IntegrityError:

            await db.rollback()

            continue

    raise HTTPException(
        status_code=500,
        detail="Could not generate a unique project slug",
    )
# =========================================================
# GET PROJECT BY SLUG
# =========================================================

async def get_existing_project(
    db: AsyncSession,
    slug: str,
    clerk_user_id: str | None = None,
):

    project = await db.scalar(
        select(Project)
        .options(
            selectinload(Project.user)
        )
        .where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    project.views_count += 1

    await db.commit()

    await db.refresh(project)

    stars_count = await db.scalar(
        select(func.count(ProjectStar.id))
        .where(
            ProjectStar.project_id == project.id
        )
    )

    is_starred = False

    is_bookmarked = False

    if clerk_user_id:

        user = await db.scalar(
            select(User).where(
                User.clerk_user_id == clerk_user_id
            )
        )

        if user:

            existing_star = await db.scalar(
                select(ProjectStar).where(
                    ProjectStar.project_id == project.id,
                    ProjectStar.user_id == user.id,
                )
            )

            is_starred = (
                existing_star is not None
            )

            existing_bookmark = await db.scalar(
                select(ProjectBookmark).where(
                    ProjectBookmark.project_id == project.id,
                    ProjectBookmark.user_id == user.id,
                )
            )

            is_bookmarked = (
                existing_bookmark is not None
            )

    return {

        "id": project.id,

        "user_id": project.user_id,

        "title": project.title,

        "slug": project.slug,

        "description": project.description,

        "github_url": project.github_url,

        "live_url": project.live_url,

        "thumbnail_url": project.thumbnail_url,

        "demo_video_url": project.demo_video_url,

        "gallery_urls": project.gallery_urls,

        "tech_stack": project.tech_stack,

        "stars_count": stars_count,

        "views_count": project.views_count,

        "comments_count": project.comments_count,

        "is_featured": project.is_featured,

        "is_starred": is_starred,

        "is_bookmarked": is_bookmarked,

        "created_at": project.created_at,

        "updated_at": project.updated_at,

        "user": {

            "username": project.user.username,

            "avatar_url": project.user.avatar_url,

            "location": project.user.location,
        }
    }
# -------------------------------- Cursor pagination like Luffys journey -------------------------------------


#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
# The World

# Imagine Luffy is sailing through islands.
# Newest islands appear FIRST in the newspaper.

# Egghead Island     (10:10)
# Wano               (10:09)
# Whole Cake         (10:08)
# Dressrosa          (10:07)
# Punk Hazard        (10:06)


# Luffy cannot visit ALL islands at once.

# Too many islands.
# Too much food.
# Too much chaos.

# So Nami says:
#       “Oi captain, let’s only visit 3 islands at a time.”



async def get_projects(
    db: AsyncSession,
    limit: int = 20,    # The limit Nami gave. 3 for islands , 20 for our DevManiac
    cursor: datetime | None = None, # like pointer, which point i am   
                                    # This is Nami's pointer flag. she in a island , she add the flag
    current_user : User | None = None ,
):
    
    # Among all islands Nami selecting closest 3 ( 20 for DevManiac ) islands
    query = (    # select project , order by 'created_at descending' , limit by a number like 20
        select(Project)
        .options(selectinload(Project.user))
        .order_by(Project.created_at.desc())
        .limit(limit + 1)
    )

    if cursor:    # if we are in a certain point or project(created at a certain time)
                     # if Nami is in an island , suppose she is in Egghead ( 10:10)
                  
        query =  query.where(    # from those 20 limited query ordered by newest
            Project.created_at < cursor # only show me all older than the cursor or point
                                        # She start searching next islands less newer than Egghead like Wano , Whole cake within limit
        )

    result = await db.scalars(query)  # all result together
                                      # whatever location she got , she write it in something and plan for next trip
    projects = result.all()
    has_more = len(projects) > limit
    if has_more:
     projects = projects[:-1] 

    next_cursor = None # Currently Nami is just in Egghead , so she dont need to be worried abot island after her limit Whole Cake

    if projects: # When Nami done visiting first 3 islands of her limit ( egghead , wano , whole cake)
        next_cursor = projects[-1].created_at  # take the last project time , this will be our new pointer now
                                               # she calculate the last island ( Whole cake)  , add a flag or pointer , mark it as a starting point for next limit , and do the process again

    serialized_projects = []

    for project in projects:

        stars_count = await db.scalar(
            select(func.count(ProjectStar.id))
            .where(
                ProjectStar.project_id == project.id
            )
        )

        is_starred = False

        if current_user:

            existing_star = await db.scalar(
                select(ProjectStar).where(
                    ProjectStar.project_id == project.id,
                    ProjectStar.user_id == current_user.id,
                )
            )

            is_starred = existing_star is not None

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

            "gallery_urls": project.gallery_urls,

            "tech_stack": project.tech_stack,

            "stars_count": stars_count,

            "views_count": project.views_count,

            "comments_count": project.comments_count,

            "is_featured": project.is_featured,

            "is_starred": is_starred,

            "created_at": project.created_at,

            "updated_at": project.updated_at,

            "user": {

                "username": project.user.username,

                "avatar_url": project.user.avatar_url,

                "location": project.user.location,
            }
        })



    return {

        "items": serialized_projects,

        "next_cursor": next_cursor,

        "has_more": has_more,
    }



# GET ONE USERS ALL PROJECT 

async def get_users_all_profile(
        db: AsyncSession , 
        
        username : str , 
):
    user = await db.scalar(
        select(User)
        .where(
            User.username == username
        )
        .options(
            selectinload(User.projects),
            selectinload(User.live_projects), 
            selectinload(User.stack_stats)
        )
    )

    if not user : 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found"
        )

    return user





# =========================================================
# UPDATE PROJECT (partial — PATCH semantics)
# =========================================================

async def update_existing_project(
    db: AsyncSession,
    slug: str,
    data: UpdateProject,
    user_id: uuid.UUID,
):

    project = await _get_project_by_slug(db, slug)

    if project.user_id != user_id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this project",
        )

    update_data = data.model_dump(exclude_unset=True)

    if "github_url" in update_data:

        (
            verified_github_url,
            github_data,
            tech_stack,
        ) = await fetch_github_url(
            update_data["github_url"]
        )

        update_data["github_url"] = verified_github_url
        update_data["github_data"] = github_data
        update_data["tech_stack"] = tech_stack

    if "live_url" in update_data:

        update_data["live_url"] = await verify_live_url(
            update_data["live_url"]
        )

    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()

    updated_project = await db.scalar(
        select(Project)
        .options(selectinload(Project.user))
        .where(Project.id == project.id)
    )

    if not updated_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found after update",
        )

    return updated_project


async def delete_existing_project(
    db: AsyncSession,
    slug: str,
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

    if project.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to delete this project",
        )

    await db.delete(project)
    await db.commit()

    return {
        "message": "Project deleted successfully",
        "slug": slug,
    }

# =========================================================
# STAR A PROJECT
# =========================================================

async def add_project_star(
    db: AsyncSession,
    slug: str,
    user_id: uuid.UUID,
):

    project = await _get_project_by_slug(
        db,
        slug,
    )

    star = ProjectStar(
        user_id=user_id,
        project_id=project.id,
    )

    db.add(star)

    try:

        await db.commit()

    except IntegrityError as e:
        await db.rollback()
        print(f"IntegrityError: {e.orig}")  # <-- see the real cause
        raise HTTPException(
            status_code=409,
            detail="Project already starred",
        )

    stars_count = await db.scalar(
        select(func.count(ProjectStar.id))
        .where(
            ProjectStar.project_id == project.id
        )
    )

    return {

    "id": project.id,

    "user_id": project.user_id,

    "title": project.title,

    "slug": project.slug,

    "description": project.description,

    "github_url": project.github_url,

    "live_url": project.live_url,

    "thumbnail_url": project.thumbnail_url,

    "demo_video_url": project.demo_video_url,

    "gallery_urls": project.gallery_urls,

    "tech_stack": project.tech_stack,

    "stars_count": stars_count,

    "views_count": project.views_count,

    "comments_count": project.comments_count,

    "is_featured": project.is_featured,

    "is_starred": True,

    "is_bookmarked": False,

    "created_at": project.created_at,

    "updated_at": project.updated_at,

    "user": {

        "username": project.user.username,

        "avatar_url": project.user.avatar_url,

        "location": project.user.location,
    }
}


async def remove_project_star(
    db: AsyncSession,
    slug: str,
    user_id: uuid.UUID,
):

    project = await db.scalar(
        select(Project)
        .options(
            selectinload(Project.user)
        )
        .where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    star = await db.scalar(
        select(ProjectStar).where(
            ProjectStar.user_id == user_id,
            ProjectStar.project_id == project.id,
        )
    )

    if not star:

        raise HTTPException(
            status_code=404,
            detail="Star not found",
        )

    await db.delete(star)

    await db.commit()

    stars_count = await db.scalar(
        select(func.count(ProjectStar.id))
        .where(
            ProjectStar.project_id == project.id
        )
    )

    return {

        "id": project.id,

        "user_id": project.user_id,

        "title": project.title,

        "slug": project.slug,

        "description": project.description,

        "github_url": project.github_url,

        "live_url": project.live_url,

        "thumbnail_url": project.thumbnail_url,

        "demo_video_url": project.demo_video_url,

        "gallery_urls": project.gallery_urls,

        "tech_stack": project.tech_stack,

        "stars_count": stars_count,

        "views_count": project.views_count,

        "comments_count": project.comments_count,

        "is_featured": project.is_featured,

        "is_starred": False,

        "created_at": project.created_at,

        "updated_at": project.updated_at,

        "user": {

            "username": project.user.username,

            "avatar_url": project.user.avatar_url,

            "location": project.user.location,
        }
    }
# =========================================================
# ADD COMMENT
# =========================================================

async def add_project_comment(
    db: AsyncSession,
    slug: str,
    data: AddComment,
    user_id: uuid.UUID,
):

    project = await _get_project_by_slug(db, slug)

    parent_id = data.parent_id

    if parent_id is not None:

        # Parent must (a) exist, (b) belong to this project,
        # (c) not be soft-deleted, (d) not itself be a reply.
        # That last check enforces two-level threading.

        parent = await db.scalar(
            select(ProjectComment).where(
                ProjectComment.id == parent_id,
                ProjectComment.project_id == project.id,
                ProjectComment.deleted_at.is_(None),
            )
        )

        if not parent:

            raise HTTPException(
                status_code=404,
                detail="Parent comment not found on this project",
            )

        if parent.parent_id is not None:

            raise HTTPException(
                status_code=400,
                detail="Replies to replies are not allowed",
            )

    comment = ProjectComment(
        user_id=user_id,
        project_id=project.id,
        parent_id=parent_id,
        content=data.content,
    )

    db.add(comment)

    project.comments_count += 1

    await db.commit()
    await db.refresh(comment)

    comment = await db.scalar(
        select(ProjectComment)
        .options(
            selectinload(ProjectComment.user)
        )
        .where(
            ProjectComment.id == comment.id
        )
    )

    return comment


# =========================================================
# UPDATE COMMENT
# =========================================================

async def update_project_comment(
    db: AsyncSession,
    comment_id: uuid.UUID,
    data: UpdateComment,
    user_id: uuid.UUID,
):

    comment = await _get_comment_by_id(db, comment_id)

    if comment.user_id != user_id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized to edit this comment",
        )

    comment.content = data.content
    comment.is_edited = True

    await db.commit()
    await db.refresh(comment)

    return comment


# =========================================================
# DELETE COMMENT  (soft delete)
#
# We don't hard-delete because the comment may have
# replies that should remain visible. Frontends typically
# render soft-deleted comments as "[deleted]" so thread
# structure is preserved.
# =========================================================

async def delete_project_comment(
    db: AsyncSession,
    comment_id: uuid.UUID,
    user_id: uuid.UUID,
):

    comment = await _get_comment_by_id(db, comment_id)

    if comment.user_id != user_id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this comment",
        )

    comment.deleted_at = func.now()

    # Decrement the project's counter to match what users see.
    project = await db.scalar(
        select(Project).where(
            Project.id == comment.project_id
        )
    )

    if project and project.comments_count > 0:
        project.comments_count -= 1

    await db.commit()

    return {"detail": "Comment deleted"}




async def get_project_comments(
    db: AsyncSession,
    slug: str,
):

    project = await _get_project_by_slug(db, slug)
    
  

    comments = await db.scalars(
        select(ProjectComment)
        .where(
            ProjectComment.project_id == project.id,
            ProjectComment.parent_id.is_(None),
            ProjectComment.deleted_at.is_(None),
        )
        .options(

                selectinload(ProjectComment.user),

                selectinload(
                    ProjectComment.replies
                ).selectinload(
                    ProjectComment.user
                ),
            )
        .order_by(ProjectComment.created_at.desc())
    )

    return comments.all()

# =========================================================
# VOTE ON COMMENT
#
# Single endpoint handles all three cases:
#   1. No existing vote        -> create new vote
#   2. Same vote as before     -> remove vote (toggle off)
#   3. Different vote          -> switch vote
#
# This matches how every real platform works (Reddit, HN,
# YouTube): clicking the same arrow twice un-votes,
# clicking the opposite arrow flips the direction.
# =========================================================

async def vote_on_comment(
    db: AsyncSession,
    comment_id: uuid.UUID,
    data: AddVote,
    user_id: uuid.UUID,
):

    comment = await _get_comment_by_id(db, comment_id)

    existing_vote = await db.scalar(
        select(ProjectCommentVote).where(
            ProjectCommentVote.user_id == user_id,
            ProjectCommentVote.comment_id == comment_id,
        )
    )

    new_vote_type = data.vote_type   # "up" or "down"

    if existing_vote is None:

        # Case 1: first-time vote.
        vote = ProjectCommentVote(
            user_id=user_id,
            comment_id=comment_id,
            vote_type=new_vote_type,
        )
        db.add(vote)

        if new_vote_type == "up":
            comment.upvotes_count += 1
        else:
            comment.downvotes_count += 1

    elif existing_vote.vote_type == new_vote_type:

        # Case 2: same vote again -> remove it (toggle off).
        await db.delete(existing_vote)

        if new_vote_type == "up" and comment.upvotes_count > 0:
            comment.upvotes_count -= 1
        elif new_vote_type == "down" and comment.downvotes_count > 0:
            comment.downvotes_count -= 1

    else:

        # Case 3: switching direction.
        # Decrement the old side, increment the new.
        existing_vote.vote_type = new_vote_type

        if new_vote_type == "up":
            comment.upvotes_count += 1
            if comment.downvotes_count > 0:
                comment.downvotes_count -= 1
        else:
            comment.downvotes_count += 1
            if comment.upvotes_count > 0:
                comment.upvotes_count -= 1

    await db.commit()
    await db.refresh(comment)

    return comment



# =========================================================
# ADD PROJECT BOOKMARK
# =========================================================

async def add_project_bookmark(
    db: AsyncSession,
    slug: str,
    user_id: uuid.UUID,
):

    project = await db.scalar(
        select(Project)
        .options(
            selectinload(Project.user)
        )
        .where(
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

        raise HTTPException(
            status_code=409,
            detail="Project already bookmarked",
        )

    bookmark = ProjectBookmark(
        user_id=user_id,
        project_id=project.id,
    )

    db.add(bookmark)

    await db.commit()

    await db.refresh(bookmark)

    return bookmark



# =========================================================
# REMOVE PROJECT BOOKMARK
# =========================================================

async def remove_project_bookmark(
    db: AsyncSession,
    slug: str,
    user_id: uuid.UUID,
):

    project = await db.scalar(
        select(Project)
        .options(
            selectinload(Project.user)
        )
        .where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    bookmark = await db.scalar(
        select(ProjectBookmark).where(
            ProjectBookmark.user_id == user_id,
            ProjectBookmark.project_id == project.id,
        )
    )

    if not bookmark:

        raise HTTPException(
            status_code=404,
            detail="Bookmark not found",
        )

    await db.delete(bookmark)

    await db.commit()

    return {
        "message": "Bookmark removed successfully"
    }