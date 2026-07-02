from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class GetFollow(BaseModel):

    id: UUID

    follower_id: UUID

    following_id: UUID

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class FollowStatus(BaseModel):

    is_following: bool

    followers_count: int

    following_count: int