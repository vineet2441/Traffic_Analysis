import os
from typing import List, Optional
from fastapi import APIRouter, Query, Header, HTTPException, Response
from fastapi.responses import StreamingResponse
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

@router.get("/video/stream")
def stream_video(range: Optional[str] = Header(None)):
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    video_path = os.path.join(ROOT_DIR, "media", "annotated_junction67.mp4")
    if not os.path.exists(video_path):
        video_path = os.path.join(ROOT_DIR, "annotated_junction67.mp4")
    
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video asset annotated_junction67.mp4 not found")
        
    file_size = os.path.getsize(video_path)
    
    if range is None:
        def iterfile():
            with open(video_path, mode="rb") as f:
                while chunk := f.read(1024 * 1024):
                    yield chunk
        headers = {
            "Content-Type": "video/mp4",
            "Content-Length": str(file_size),
            "Accept-Ranges": "bytes"
        }
        return StreamingResponse(iterfile(), media_type="video/mp4", headers=headers)
        
    bytes_str = range.replace("bytes=", "")
    parts = bytes_str.split("-")
    start = int(parts[0]) if parts[0] else 0
    end = int(parts[1]) if parts[1] and int(parts[1]) < file_size else file_size - 1
    
    if start >= file_size or end >= file_size or start > end:
        return Response(status_code=416, headers={"Content-Range": f"bytes */{file_size}"})
        
    chunk_size = (end - start) + 1
    
    def iterfile():
        with open(video_path, mode="rb") as f:
            f.seek(start)
            bytes_left = chunk_size
            while bytes_left > 0:
                read_size = min(bytes_left, 1024 * 1024)
                data = f.read(read_size)
                if not data:
                    break
                bytes_left -= len(data)
                yield data

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(chunk_size),
        "Content-Type": "video/mp4",
    }
    return StreamingResponse(iterfile(), status_code=206, headers=headers, media_type="video/mp4")
