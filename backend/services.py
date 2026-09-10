import os
import json
import numpy as np
from typing import List, Dict, Any, Optional
from .models import KpiSummary, SystemStatus, VideoInfo
from .seed_data import generate_intersection_trajectories

class TrajectoryService:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), "data", "trajectories.json")
        self._ensure_data_exists()
        self.trajectories = self._load_trajectories()

    def _ensure_data_exists(self):
        if not os.path.exists(self.data_path):
            generate_intersection_trajectories()

    def _load_trajectories(self) -> List[Dict[str, Any]]:
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_trajectories(self, frame: Optional[int] = None) -> List[Dict[str, Any]]:
        if frame is not None:
            return [f for f in self.trajectories if f["frame_index"] == frame]
        return self.trajectories

    def get_kpi_summary(self) -> KpiSummary:
        class_counts = {"Two-Wheeler": 0, "Three-Wheeler": 0, "Car": 0, "LCV": 0}
        speeds = []
        high_risk = 0
        total_unique_ids = set()

        for frame in self.trajectories:
            for det in frame["detections"]:
                total_unique_ids.add(det["id"])
                v_cls = det["class"]
                if v_cls in class_counts:
                    class_counts[v_cls] += 1
                speeds.append(det["speed_kmh"])
                if det["risk_score"] > 0.65:
                    high_risk += 1

        avg_speed = float(np.mean(speeds)) if speeds else 0.0
        dominant = max(class_counts, key=class_counts.get) if class_counts else "Two-Wheeler"

        return KpiSummary(
            total_detections=len(total_unique_ids),
            class_counts=class_counts,
            high_risk_count=high_risk,
            avg_speed_kmh=round(avg_speed, 1),
            dominant_class=dominant,
            risk_index=0.34
        )

    def get_system_status(self) -> SystemStatus:
        return SystemStatus(
            status="HEALTHY",
            uptime_seconds=3600.0,
            pipeline_fps=29.8,
            active_model="YOLOv8x + ByteTRACK",
            device="NVIDIA RTX 4090"
        )

    def get_video_info(self) -> VideoInfo:
        return VideoInfo(
            filename="annotated_junction67.mp4",
            resolution="1920x1080",
            fps=30.0,
            total_frames=900,
            duration_seconds=30.0
        )

trajectory_service = TrajectoryService()
