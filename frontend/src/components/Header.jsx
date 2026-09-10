import React from 'react';
import { Activity, ShieldCheck, Cpu, Clock } from 'lucide-react';

export default function Header({ status, currentFrameIndex, currentTimeSec }) {
  const formattedTime = new Date(currentTimeSec * 1000).toISOString().substr(14, 5);

  return (
    <header className="glass-card rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 rounded-xl border border-blue-500/30 shadow-glow-blue">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Junction 67 Analytics</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5 shadow-glow-emerald">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE PIPELINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Outer Ring Road Intersection • Computer Vision & Trajectory Stream
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 font-medium">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>{status?.active_model || 'YOLOv8x + ByteTRACK'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">{status?.pipeline_fps || 29.8} FPS</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>F#{currentFrameIndex.toString().padStart(3, '0')}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">{formattedTime}s</span>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>System Healthy</span>
        </div>
      </div>
    </header>
  );
}
