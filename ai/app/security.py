from fastapi import Header, HTTPException, status, Depends
from .config import settings


async def api_key_guard(x_api_key: str | None = Header(default=None)):
    if not x_api_key or x_api_key != settings.API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
    return True