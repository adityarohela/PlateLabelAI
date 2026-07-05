from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analyze import router as analyze_router
from app.config import CORS_ORIGINS

app = FastAPI(
    title="PlateLabel AI",
    description="AI Powered Food Recognition and Nutrition Analyzer",
    version="1.0.0",
)

origins = ["*"] if CORS_ORIGINS.strip() == "*" else [o.strip() for o in CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)


@app.get("/")
async def root():
    return {"application": "PlateLabel AI", "status": "Running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
