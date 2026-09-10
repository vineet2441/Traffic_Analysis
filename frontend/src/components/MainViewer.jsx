import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Layers, MapPin, Flame, Eye } from 'lucide-react';

const CLASS_COLORS = {
  "Two-Wheeler": "#007AFF",
  "Three-Wheeler": "#FF9500",
  "Car": "#34C759",
  "LCV": "#FF3B30"
};

export default function MainViewer({ currentTimeSec, setCurrentTimeSec, currentFrameData, allTrajectories }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mapMode, setMapMode] = useState('base'); // 'base' or 'heatmap'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const videoUrl = "/media/annotated_junction67.mp4";
  const baseMapUrl = "/media/Map.jpeg";
  const heatmapUrl = "/media/HeatMap.jpeg";

  // Synchronize playback state
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeSec(videoRef.current.currentTime);
    }
  };

  // Canvas rendering of vehicle trajectories synced to video time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!currentFrameData || !currentFrameData.detections) return;

    // Draw active detections for current frame
    currentFrameData.detections.forEach((det) => {
      // Scale positions from 1920x1080 resolution to canvas size
      const scaleX = width / 1920;
      const scaleY = height / 1080;

      const cx = det.x * scaleX;
      const cy = det.y * scaleY;
      const color = CLASS_COLORS[det.class] || '#007AFF';

      // Draw trajectory motion trail for past 10 frames
      if (allTrajectories && allTrajectories.length > 0) {
        ctx.beginPath();
        const startFrame = Math.max(0, currentFrameData.frame_index - 15);
        let first = true;

        for (let f = startFrame; f <= currentFrameData.frame_index; f++) {
          const frameObj = allTrajectories.find(t => t.frame_index === f);
          if (frameObj) {
            const histDet = frameObj.detections.find(d => d.id === det.id);
            if (histDet) {
              const hx = histDet.x * scaleX;
              const hy = histDet.y * scaleY;
              if (first) {
                ctx.moveTo(hx, hy);
                first = false;
              } else {
                ctx.lineTo(hx, hy);
              }
            }
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // Draw bounding box / position marker
      const boxW = (det.width || 50) * scaleX;
      const boxH = (det.height || 80) * scaleY;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);

      // Draw center dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label tag
      const label = `#${det.id} ${det.class} (${det.speed_kmh}km/h)`;
      ctx.font = '10px Inter, sans-serif';
      const textMetrics = ctx.measureText(label);

      ctx.fillStyle = 'rgba(10, 13, 20, 0.85)';
      ctx.fillRect(cx - boxW / 2, cy - boxH / 2 - 16, textMetrics.width + 8, 14);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, cx - boxW / 2 + 4, cy - boxH / 2 - 5);
    });

  }, [currentFrameData, allTrajectories, mapMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Left Pane: Synchronized Video Feed */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-ios-accent" />
            <h2 className="text-sm font-semibold text-white">Camera Stream 01</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">1080p @ 30FPS</span>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center group border border-white/10">
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />
          <button
            onClick={togglePlay}
            className="absolute p-4 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity hover:scale-105"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>
        </div>

        {/* Video Scrubber Controls */}
        <div className="mt-3 flex items-center gap-3">
          <button onClick={togglePlay} className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="30"
            step="0.05"
            value={currentTimeSec}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTimeSec(val);
              if (videoRef.current) videoRef.current.currentTime = val;
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ios-accent"
          />
        </div>
      </div>

      {/* Right Pane: Interactive Map Viewer & Trajectory Canvas Overlay */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ios-indigo" />
            <h2 className="text-sm font-semibold text-white">GIS Trajectory Overlay</h2>
          </div>

          {/* Toggle Map Mode Buttons */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 gap-1 text-xs">
            <button
              onClick={() => setMapMode('base')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                mapMode === 'base'
                  ? 'bg-ios-accent text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Base Map
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                mapMode === 'heatmap'
                  ? 'bg-ios-rose text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Risk Heatmap
            </button>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-white/10">
          {/* Background Map Image */}
          <img
            src={mapMode === 'base' ? baseMapUrl : heatmapUrl}
            alt="Intersection GIS Map"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          {/* Canvas overlay for trajectories */}
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-mono">Active Vehicles: {currentFrameData?.detections?.length || 0}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-ios-accent"></span>
              <span>Two-Wheeler</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-ios-amber"></span>
              <span>Three-Wheeler</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-ios-emerald"></span>
              <span>Car</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-ios-rose"></span>
              <span>LCV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
