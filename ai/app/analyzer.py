from typing import Dict, Tuple
from PIL import Image, ImageOps
from io import BytesIO
import torch


_AN = None
_PR = None


# Lazy load to speed startup


def _load_clip():
    global _AN, _PR
    if _AN is None:
        from transformers import CLIPModel, CLIPProcessor # type: ignore
        _AN = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        _AN.eval()
        _PR = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    return _AN, _PR




def normalize_image(img: Image.Image) -> Tuple[Image.Image, int, int]:
# auto-orient by EXIF and force RGB, strip metadata
    img = ImageOps.exif_transpose(img).convert("RGB")
    w, h = img.size
    return img, w, h




def analyze_mock(_: bytes) -> Dict:
# deterministic pseudo-probability without ML (for offline demos)
    import random
    p = random.random()
    return {
        "engine": "mock",
        "labels": ["healthy", "infected"],
        "probs": [round(1 - p, 3), round(p, 3)],
        "prediction": "infected" if p > 0.5 else "healthy",
        "explain": "Mock analyzer used. Configure ANALYZER_ENGINE=clip to enable zero-shot CV.",
    }

def analyze_clip(data: bytes) -> Dict:
    model, proc = _load_clip()
    img = Image.open(BytesIO(data))
    img, w, h = normalize_image(img)
    prompts = ["a photo of a healthy post-operative wound", "a photo of an infected post-operative wound"]
    inputs = proc(text=prompts, images=img, return_tensors="pt", padding=True)
    with torch.no_grad():
        out = model(**inputs)
        probs = out.logits_per_image.softmax(dim=1).cpu().numpy().tolist()[0]
    pred_idx = int(probs[1] > probs[0])
    return {
        "engine": "clip",
        "labels": ["healthy", "infected"],
        "probs": [round(float(probs[0]), 4), round(float(probs[1]), 4)],
        "prediction": ["healthy", "infected"][pred_idx],
        "dimensions": {"width": w, "height": h},
        "disclaimer": "This is a prototype; not a medical device. Consult a clinician.",
    }