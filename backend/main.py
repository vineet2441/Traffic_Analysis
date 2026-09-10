import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes import router

app = FastAPI(
    title="Traffic Analytics API",
    description="Computer Vision Trajectory Analysis Backend for Junction 67",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root directory path to serve media assets
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.mount("/media", StaticFiles(directory=ROOT_DIR), name="media")

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Traffic Analytics API Operational. Access /docs for API documentation."}
