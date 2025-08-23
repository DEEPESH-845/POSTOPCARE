from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime


class PhotoOut(BaseModel):
    id: int
    user_id: str
    day: int
    storage_url: str
    thumb_url: Optional[str] = None
    content_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime
    analysis: Optional[Dict]


class UploadResponse(BaseModel):
    userId: str = Field(alias="userId")
    day: int
    photoId: int
    photoUrl: str
    thumbUrl: Optional[str] = None
    analysis: Optional[Dict]