const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchSystemStatus() {
  const res = await fetch(`${BASE_URL}/api/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function fetchKpiSummary() {
  const res = await fetch(`${BASE_URL}/api/analytics/kpis`);
  if (!res.ok) throw new Error('Failed to fetch KPI summary');
  return res.json();
}

export async function fetchTrajectories(frameIndex = null) {
  const url = frameIndex !== null 
    ? `${BASE_URL}/api/trajectories?frame=${frameIndex}` 
    : `${BASE_URL}/api/trajectories`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch trajectories');
  return res.json();
}

export async function fetchVideoInfo() {
  const res = await fetch(`${BASE_URL}/api/video/info`);
  if (!res.ok) throw new Error('Failed to fetch video info');
  return res.json();
}
