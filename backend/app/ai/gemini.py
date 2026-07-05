"""
Talks to Gemini Vision to identify food and estimate nutrition.

Key behaviors that were missing before and caused the app to look "broken"
even though the AI call was actually fine:
- Quota / rate-limit errors (429 ResourceExhausted) are now caught and
  raised as a clear GeminiQuotaExceeded, instead of bubbling up as a raw
  500 with a confusing traceback.
- If Gemini's response isn't valid JSON (it occasionally wraps things
  differently), that's caught and raised as GeminiResponseError instead
  of crashing with json.decoder.JSONDecodeError.
- The image file is opened with a `with` block so Windows releases the
  file handle immediately — this is what was causing the temp-file
  PermissionError during cleanup.
"""
import json

from PIL import Image
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, GoogleAPICallError

from ..config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)

PROMPT = """
You are an expert nutritionist and food recognition AI.

Analyze the uploaded food image carefully.

Identify every visible food item.

Estimate realistic nutritional values using standard food databases.

Return ONLY valid JSON.

{
  "meal_name": "",
  "diet_type": "",
  "health_score": 0,

  "foods": [
    {
      "name": "",
      "quantity": "",
      "weight_g": 0,
      "calories": 0,
      "protein_g": 0,
      "carbs_g": 0,
      "fat_g": 0,
      "fiber_g": 0,
      "confidence": 0
    }
  ],

  "totals": {
    "calories": 0,
    "protein_g": 0,
    "carbs_g": 0,
    "fat_g": 0,
    "fiber_g": 0
  },

  "allergens": [],

  "recommendation": ""
}

Rules:

Estimate nutrition realistically.
Never leave fields empty.
Return JSON only.
No markdown.
No explanation.
"""


class GeminiQuotaExceeded(Exception):
    """Gemini's free-tier rate limit or daily quota was hit."""


class GeminiResponseError(Exception):
    """Gemini responded, but not with the JSON shape we expect."""


def identify_food(image_path: str) -> dict:
    if not GEMINI_API_KEY:
        raise GeminiResponseError(
            "GEMINI_API_KEY is not set in backend/.env — the key you connected "
            "earlier should already be there; check it wasn't accidentally removed."
        )

    try:
        with Image.open(image_path) as image:
            response = model.generate_content([PROMPT, image])
    except ResourceExhausted as exc:
        raise GeminiQuotaExceeded(
            "Gemini's free-tier rate limit (requests per minute) or daily quota "
            "has been reached. Wait a minute (or until the daily quota resets) "
            "and try again."
        ) from exc
    except GoogleAPICallError as exc:
        raise GeminiResponseError(f"Gemini API call failed: {exc}") from exc

    raw_text = (response.text or "").replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise GeminiResponseError(
            "Gemini didn't return valid JSON for this image. Try a clearer, "
            "well-lit photo of the food."
        ) from exc
