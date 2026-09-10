import React from 'react';
import { Activity, ShieldCheck, Cpu, Clock } from 'lucide-react';

export default function Header({ status, currentFrameIndex, currentTimeSec }) {
  const formattedTime = new Date(currentTimeSec * 1000).toISOString().substr(14, 5);

  return (
    <header className="glass-card rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-ios-accent/10 text-ios-accent rounded-xl border border-ios-accent/20">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Junction 67 Analytics</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              LIVE PIPELINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Outer Ring Road Intersection • Computer Vision & Trajectory Stream
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 font-medium shadow-sm">
          <Cpu className="w-4 h-4 text-ios-accent" />
          <span>{status?.active_model || 'YOLOv8x + ByteTRACK'}</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-semibold">{status?.pipeline_fps || 29.8} FPS</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
          <Clock className="w-4 h-4 text-ios-amber" />
          <span>F#{currentFrameIndex.toString().padStart(3, '0')}</span>
          <span className="text-slate-300">|</span>
          <span className="text-ios-amber font-bold">{formattedTime}s</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-600 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>System Healthy</span>
        </div>
      </div>
    </header>
  );
}
