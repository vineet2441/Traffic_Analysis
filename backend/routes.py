from typing import List, Optional
from fastapi import APIRouter, Query
from .models import FrameTrajectory, KpiSummary, SystemStatus, VideoInfo
from .services import trajectory_service

router = APIRouter(prefix="/api", tags=["Traffic Analytics"])

@router.get("/status", response_model=SystemStatus)
def get_status():
    return trajectory_service.get_system_status()

@router.get("/trajectories", response_model=List[FrameTrajectory])
def get_trajectories(frame: Optional[int] = Query(None, ge=0, le=899)):
    return trajectory_service.get_trajectories(frame)

@router.get("/analytics/kpis", response_model=KpiSummary)
def get_kpi_summary():
    return trajectory_service.get_kpi_summary()

@router.get("/video/info", response_model=VideoInfo)
def get_video_info():
    return trajectory_service.get_video_info()
