from fastapi import HTTPException, Query, status

from app.core.config import settings


def require_admin(
    clerk_user_id: str = Query(...),
) -> str:
    if clerk_user_id not in settings.admin_clerk_user_id_list:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return clerk_user_id