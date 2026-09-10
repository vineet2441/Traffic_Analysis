import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';

const COLORS = ['#007AFF', '#FF9500', '#34C759', '#FF3B30'];

export default function AnalyticsPanel({ kpis, allTrajectories }) {
  const pieData = useMemo(() => {
    if (!kpis || !kpis.class_counts) return [];
    return Object.entries(kpis.class_counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [kpis]);

  const speedTrendData = useMemo(() => {
    if (!allTrajectories || allTrajectories.length === 0) return [];
    // Downsample trajectories into 30 time steps for line chart rendering
    const step = Math.max(1, Math.floor(allTrajectories.length / 30));
    const data = [];

    for (let i = 0; i < allTrajectories.length; i += step) {
      const frame = allTrajectories[i];
      const speeds = frame.detections.map(d => d.speed_kmh);
      const avgSpeed = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
      data.push({
        time: `${frame.timestamp_sec}s`,
        avgSpeed: round(avgSpeed, 1),
        count: frame.detections.length
      });
    }

    return data;
  }, [allTrajectories]);

  function round(val, decimals) {
    return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Vehicle Class Distribution Donut Chart */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-ios-accent" />
            <h3 className="text-sm font-semibold text-white">Vehicle Class Composition</h3>
          </div>
          <span className="text-xs text-slate-400">Modal Split</span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121824',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/5 text-xs text-slate-300">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-900/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                <span>{item.name}</span>
              </div>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Speed & Traffic Velocity Trend Line Chart */}
      <div className="glass-card rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-ios-emerald" />
            <h3 className="text-sm font-semibold text-white">Traffic Velocity & Temporal Dynamics</h3>
          </div>
          <span className="text-xs text-slate-400">Average Velocity (km/h) vs Time</span>
        </div>

        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 60]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121824',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="avgSpeed"
                name="Avg Speed (km/h)"
                stroke="#34C759"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#34C759' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Active Vehicle Count"
                stroke="#007AFF"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Intersection Congestion Index: <span className="text-emerald-400 font-semibold">Low (Free Flow)</span></span>
          <span className="font-mono text-slate-500">Data Window: 30.0s @ 30 FPS</span>
        </div>
      </div>
    </div>
  );
}
