import os
from turtle import up
from typing import Tuple, Optional
from PIL import Image
from io import BytesIO
from datetime import datetime
from .config import settings


try:
    import cloudinary
    import cloudinary.uploader
except Exception: # pragma: no cover
    cloudinary = None


class StorageBackend:
    def save(self, *, user_id: str, day: int, filename: str, data: bytes, content_type: str) -> Tuple[str, Optional[str]]:
        raise NotImplementedError


class LocalStorage(StorageBackend):
    def save(self, *, user_id: str, day: int, filename: str, data: bytes, content_type: str) -> Tuple[str, Optional[str]]:
    # Path: ./media/{user}/{day}/{timestamp_filename}
        safe_user = user_id.replace("/", "_")
        folder = os.path.join(settings.LOCAL_MEDIA_ROOT, safe_user, str(day))
        os.makedirs(folder, exist_ok=True)
        ts = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        base, ext = os.path.splitext(filename)
        fname = f"{ts}{ext.lower()}"
        full_path = os.path.join(folder, fname)
        with open(full_path, "wb") as f:
            f.write(data)

        thumb_url = None
        try:
            img = Image.open(BytesIO(data))
            img.thumbnail((512, 512))
            thumb_name = f"thumb_{ts}.jpg"
            thumb_path = os.path.join(folder, thumb_name)
            img.convert("RGB").save(thumb_path, format="JPEG", quality=85)
            if settings.BASE_URL:
                thumb_url = f"{settings.BASE_URL}/media/{safe_user}/{day}/{thumb_name}"
        except Exception:
            pass
        if settings.BASE_URL:
            public_url = f"{settings.BASE_URL}/media/{safe_user}/{day}/{fname}"
        else:
            public_url = full_path
        return public_url, thumb_url


class CloudinaryStorage(StorageBackend):
    def __init__(self):
        if not cloudinary:
            raise RuntimeError("cloudinary package not available")
        cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


    def save(self, *, user_id: str, day: int, filename: str, data: bytes, content_type: str) -> Tuple[str, Optional[str]]:
        folder = f"{settings.CLOUDINARY_FOLDER}/{user_id}/{day}"
        up = cloudinary.uploader.upload(
            BytesIO(data),
            folder=folder,
            public_id=None,
            resource_type="image",
            overwrite=False,
        )
        url = up.get("secure_url")
        thumb = up.get("eager") or up.get("thumbnail_url")
        return url, thumb
    
def get_storage() -> StorageBackend:
    if settings.STORAGE_BACKEND == "cloudinary":
        return CloudinaryStorage()
    return LocalStorage()