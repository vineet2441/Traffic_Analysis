import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchSystemStatus, fetchKpiSummary, fetchTrajectories, fetchVideoInfo } from '../services/api';

export function useTrafficData() {
  const [status, setStatus] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [allTrajectories, setAllTrajectories] = useState([]);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [statusRes, kpiRes, trajRes, videoRes] = await Promise.all([
        fetchSystemStatus(),
        fetchKpiSummary(),
        fetchTrajectories(),
        fetchVideoInfo()
      ]);
      setStatus(statusRes);
      setKpis(kpiRes);
      setAllTrajectories(trajRes);
      setVideoInfo(videoRes);
      setError(null);
    } catch (err) {
      console.error("Error initializing traffic data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Frame calculation based on 30 FPS video playback time
  const currentFrameIndex = useMemo(() => {
    if (!videoInfo) return 0;
    const frame = Math.floor(currentTimeSec * videoInfo.fps);
    return Math.min(Math.max(0, frame), videoInfo.total_frames - 1);
  }, [currentTimeSec, videoInfo]);

  const currentFrameData = useMemo(() => {
    if (!allTrajectories.length) return null;
    return allTrajectories.find(f => f.frame_index === currentFrameIndex) || null;
  }, [allTrajectories, currentFrameIndex]);

  return {
    status,
    kpis,
    videoInfo,
    loading,
    error,
    currentTimeSec,
    setCurrentTimeSec,
    currentFrameIndex,
    currentFrameData,
    allTrajectories,
    refresh: loadInitialData
  };
}
