from sqlmodel import SQLModel, Field, Column, JSON
from typing import Optional, Dict
from datetime import datetime


class Photo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    day: int
    file_name: str
    content_type: str
    storage_url: str
    thumb_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    analysis: Dict | None = Field(default=None, sa_column=Column(JSON))