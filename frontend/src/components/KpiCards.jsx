import React from 'react';
import { Car, AlertTriangle, Gauge, Bike } from 'lucide-react';

export default function KpiCards({ kpis }) {
  const cards = [
    {
      title: "Total Tracked Vehicles",
      value: kpis?.total_detections ?? "--",
      unit: "unique IDs",
      icon: Car,
      color: "text-blue-400",
      bgColor: "bg-blue-500/15",
      borderColor: "border-blue-500/30",
      cardGrad: "from-blue-500/10 via-transparent to-transparent",
      shadow: "shadow-glow-blue",
      trend: "+12.4% vs avg"
    },
    {
      title: "High-Risk Near Misses",
      value: kpis?.high_risk_count ?? "--",
      unit: "events flagged",
      icon: AlertTriangle,
      color: "text-rose-400",
      bgColor: "bg-rose-500/15",
      borderColor: "border-rose-500/30",
      cardGrad: "from-rose-500/10 via-transparent to-transparent",
      shadow: "shadow-glow-rose",
      trend: "Risk Index: " + (kpis?.risk_index ?? "0.34")
    },
    {
      title: "Average Speed",
      value: kpis?.avg_speed_kmh ?? "--",
      unit: "km/h",
      icon: Gauge,
      color: "text-amber-400",
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
      cardGrad: "from-amber-500/10 via-transparent to-transparent",
      shadow: "shadow-glow-amber",
      trend: "Normal flow velocity"
    },
    {
      title: "Primary Vehicle Class",
      value: kpis?.dominant_class ?? "Two-Wheeler",
      unit: "45% of total volume",
      icon: Bike,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/15",
      borderColor: "border-indigo-500/30",
      cardGrad: "from-indigo-500/10 via-transparent to-transparent",
      shadow: "shadow-glow-blue",
      trend: "Indian Urban Profile"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br ${card.cardGrad} border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color} border ${card.borderColor} ${card.shadow}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
              <span className="text-xs font-medium text-slate-400">{card.unit}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
