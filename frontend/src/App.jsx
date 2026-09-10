import React from 'react';
import { useTrafficData } from './hooks/useTrafficData';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import MainViewer from './components/MainViewer';
import AnalyticsPanel from './components/AnalyticsPanel';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const {
    status,
    kpis,
    loading,
    error,
    currentTimeSec,
    setCurrentTimeSec,
    currentFrameIndex,
    currentFrameData,
    allTrajectories,
    refresh
  } = useTrafficData();

  if (loading) {
    return (
      <div className="min-h-screen bg-ios-bg flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-10 h-10 text-ios-accent animate-spin mb-4" />
        <h2 className="text-lg font-semibold">Initializing Traffic Vision Engine...</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting to FastAPI backend & loading frame trajectories</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ios-bg flex flex-col items-center justify-center text-slate-300 p-4">
        <div className="glass-card rounded-2xl p-6 max-w-md text-center border-ios-rose/30">
          <h2 className="text-lg font-bold text-ios-rose mb-2">Backend Connection Error</h2>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-ios-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-bg p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Top Bar Header */}
      <Header
        status={status}
        currentFrameIndex={currentFrameIndex}
        currentTimeSec={currentTimeSec}
      />

      {/* KPI Overview Cards */}
      <KpiCards kpis={kpis} />

      {/* Main Dual-Pane Video & GIS Trajectory Viewer */}
      <MainViewer
        currentTimeSec={currentTimeSec}
        setCurrentTimeSec={setCurrentTimeSec}
        currentFrameData={currentFrameData}
        allTrajectories={allTrajectories}
      />

      {/* Analytics Charts Panel */}
      <AnalyticsPanel
        kpis={kpis}
        allTrajectories={allTrajectories}
      />

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500 border-t border-white/5 pt-4">
        Junction 67 Traffic Analytics • Computer Vision Research Project • FastAPI & React Dashboard
      </footer>
    </div>
  );
}
