from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import select, Session
from typing import List

from .config import settings
from .security import api_key_guard
from .db import init_db, engine, get_session
from .models import Photo
from .schemas import PhotoOut, UploadResponse
from .storage import get_storage
from .utils import validate_file, strip_exif_and_get_dims
from .analyzer import analyze_mock, analyze_clip

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# CORS
origins = [o.strip() for o in settings.ALLOW_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static serving for local files (if BASE_URL is set to http://host:port)
app.mount("/media", StaticFiles(directory=settings.LOCAL_MEDIA_ROOT), name="media")


@app.on_event("startup")
def on_start():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/photo/upload", response_model=UploadResponse, dependencies=[Depends(api_key_guard)])
async def upload_photo(
    userId: str = Form(...),
    day: int = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    # Validate
    try:
        contents = await file.read()
        validate_file(file.content_type or "", len(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Normalize/strip EXIF for privacy
    try:
        clean_bytes, width, height = strip_exif_and_get_dims(contents)
    except Exception:
        clean_bytes, width, height = contents, None, None

    # Analyze
    if settings.ANALYZER_ENGINE == "clip":
        try:
            analysis = analyze_clip(clean_bytes)
        except Exception as exc:  # fallback to mock if transformers not available
            analysis = analyze_mock(clean_bytes) | {"note": f"clip failed: {exc}"}
    else:
        analysis = analyze_mock(clean_bytes)

    # Store
    storage = get_storage()
    public_url, thumb_url = storage.save(
        user_id=userId, day=day, filename=file.filename, data=clean_bytes, content_type=file.content_type or "image/jpeg"
    )

    # Persist
    photo = Photo(
        user_id=userId,
        day=day,
        file_name=file.filename,
        content_type=file.content_type or "image/jpeg",
        storage_url=public_url,
        thumb_url=thumb_url,
        width=analysis.get("dimensions", {}).get("width"),
        height=analysis.get("dimensions", {}).get("height"),
        analysis=analysis,
    )
    session.add(photo)
    session.commit()
    session.refresh(photo)

    return {
        "userId": userId,
        "day": day,
        "photoId": photo.id,
        "photoUrl": photo.storage_url,
        "thumbUrl": photo.thumb_url,
        "analysis": photo.analysis,
    }


@app.get("/photo/{user_id}/{day}", response_model=List[PhotoOut], dependencies=[Depends(api_key_guard)])
def get_photos_for_day(user_id: str, day: int, session: Session = Depends(get_session)):
    stmt = select(Photo).where(Photo.user_id == user_id, Photo.day == day).order_by(Photo.created_at.desc())
    photos = session.exec(stmt).all()
    return photos


@app.get("/clinician/photos", response_model=List[PhotoOut], dependencies=[Depends(api_key_guard)])
def clinician_list(userId: str, fromDay: int | None = None, toDay: int | None = None, session: Session = Depends(get_session)):
    stmt = select(Photo).where(Photo.user_id == userId)
    if fromDay is not None:
        stmt = stmt.where(Photo.day >= fromDay)
    if toDay is not None:
        stmt = stmt.where(Photo.day <= toDay)
    stmt = stmt.order_by(Photo.day, Photo.created_at)
    return session.exec(stmt).all()

@app.post("/detect-arm-injury")
async def detect_arm_injury(file: UploadFile = File(...)):
    import torch
    from PIL import Image
    import io
    from transformers import CLIPProcessor, CLIPModel
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
    clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    # Load image from upload
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Prompts
    labels = ["a photo of a healthy arm", "a photo of an injured arm"]

    # Run CLIP
    inputs = clip_processor(text=labels, images=image, return_tensors="pt", padding=True).to(device)
    outputs = clip_model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1).detach().cpu().numpy()[0]

    prediction = "healthy" if probs[0] > probs[1] else "injured"

    return JSONResponse({
        "prediction": prediction,
        "confidence": float(probs.max())
    })