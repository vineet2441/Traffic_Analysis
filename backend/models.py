from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class VehicleDetection(BaseModel):
    id: int
    vehicle_class: str = Field(..., alias="class")
    x: float
    y: float
    width: float
    height: float
    speed_kmh: float
    risk_score: float

    class Config:
        populate_by_name = True

class FrameTrajectory(BaseModel):
    frame_index: int
    timestamp_sec: float
    detections: List[VehicleDetection]

class ClassDistribution(BaseModel):
    two_wheeler: int = 0
    three_wheeler: int = 0
    car: int = 0
    lcv: int = 0

class KpiSummary(BaseModel):
    total_detections: int
    class_counts: Dict[str, int]
    high_risk_count: int
    avg_speed_kmh: float
    dominant_class: str
    risk_index: float

class SystemStatus(BaseModel):
    status: str
    uptime_seconds: float
    pipeline_fps: float
    active_model: str
    device: str

class VideoInfo(BaseModel):
    filename: str
    resolution: str
    fps: float
    total_frames: int
    duration_seconds: float
