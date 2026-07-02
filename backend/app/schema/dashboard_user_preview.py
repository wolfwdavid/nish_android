from pydantic import BaseModel
from uuid import UUID


class DashboardUserPreview(BaseModel):

    clerk_user_id: str

    avatar_url: str | None = None

    display_name: str | None = None

    username: str | None = None

    banner_url : str | None = None

    class Config:
        from_attributes = True