import os
import tempfile

from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, UnidentifiedImageError

from ..config import ALLOWED_CONTENT_TYPES, MAX_UPLOAD_MB, MIN_RESOLUTION_PX
from ..ai.gemini import identify_food, GeminiQuotaExceeded, GeminiResponseError

router = APIRouter()

REQUIRED_KEYS = ("meal_name", "diet_type", "health_score", "foods", "totals", "allergens", "recommendation")


@router.post("/analyze")
async def analyze_food(file: UploadFile = File(...)):
    # ---- Validate Image (matches the frontend's validation step) ----
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    raw_bytes = await file.read()
    size_mb = len(raw_bytes) / (1024 * 1024)
    if size_mb > MAX_UPLOAD_MB:
        raise HTTPException(status_code=400, detail=f"Image is {size_mb:.1f}MB; max is {MAX_UPLOAD_MB}MB")

    suffix = os.path.splitext(file.filename or "upload.jpg")[1] or ".jpg"
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp.write(raw_bytes)
            temp_path = temp.name

        # Quick resolution/corruption check before spending a Gemini call on a bad file
        try:
            with Image.open(temp_path) as check_img:
                check_img.verify()
            with Image.open(temp_path) as check_img:
                width, height = check_img.size
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="This file isn't a readable image.")

        if width < MIN_RESOLUTION_PX or height < MIN_RESOLUTION_PX:
            raise HTTPException(
                status_code=400,
                detail=f"Resolution {width}x{height} is below the {MIN_RESOLUTION_PX}px minimum",
            )

        # ---- Food Detection AI (Gemini Vision) + Nutrition estimation ----
        foods = identify_food(temp_path)

        missing = [k for k in REQUIRED_KEYS if k not in foods]
        if missing:
            raise GeminiResponseError(f"Gemini's response was missing fields: {', '.join(missing)}")

        return {
            "success": True,
            "meal_name": foods["meal_name"],
            "diet_type": foods["diet_type"],
            "health_score": foods["health_score"],
            "foods": foods["foods"],
            "totals": foods["totals"],
            "allergens": foods["allergens"],
            "recommendation": foods["recommendation"],
        }

    except GeminiQuotaExceeded as exc:
        raise HTTPException(status_code=429, detail=str(exc))
    except GeminiResponseError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        if temp_path:
            try:
                os.remove(temp_path)
            except (PermissionError, FileNotFoundError):
                pass
