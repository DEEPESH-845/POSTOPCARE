from sqlmodel import SQLModel, create_engine, Session
from .config import settings
import os


DB_URL = "sqlite:///./postopcare.db"
engine = create_engine(DB_URL, echo=False, connect_args={"check_same_thread": False})


def init_db():
    os.makedirs(settings.LOCAL_MEDIA_ROOT, exist_ok=True)
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session