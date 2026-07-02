from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PublicAppNoticeItem(BaseModel):
    id: UUID
    title: str
    message: str
    notice_type: str
    cta_label: str | None
    cta_href: str | None
    show_once: bool

    model_config = ConfigDict(
        from_attributes=True,
    )