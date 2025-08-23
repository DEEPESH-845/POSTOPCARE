from PIL import Image, ImageOps
from io import BytesIO
from typing import Tuple

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}
MAX_UPLOAD_MB = 15


def validate_file(content_type: str, size_bytes: int):
    if content_type.lower() not in ALLOWED_MIME:
        raise ValueError("Unsupported file type")
    if size_bytes > MAX_UPLOAD_MB * 1024 * 1024:
        raise ValueError("File too large")


def strip_exif_and_get_dims(data: bytes) -> Tuple[bytes, int, int]:
    img = Image.open(BytesIO(data))
    img = ImageOps.exif_transpose(img).convert("RGB")
    w, h = img.size
    out = BytesIO()
    img.save(out, format="JPEG", quality=92)
    return out.getvalue(), w, h