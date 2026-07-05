import os
from dotenv import load_dotenv

# Loads backend/.env — do not rename GEMINI_API_KEY here, the key you already
# connected in .env uses that exact name and will keep working as-is.
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Comma-separated list in .env if you ever want to lock this down, e.g.
# CORS_ORIGINS=http://localhost:5173,http://localhost:5174
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

MAX_UPLOAD_MB = float(os.getenv("MAX_UPLOAD_MB", "10"))
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MIN_RESOLUTION_PX = 100
