import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Layers, MapPin, Flame, Eye, Volume2, VolumeX } from 'lucide-react';

const CLASS_COLORS = {
  "Two-Wheeler": "#007AFF",
  "Three-Wheeler": "#FF9500",
  "Car": "#34C759",
  "LCV": "#FF3B30"
};

export default function MainViewer({ currentTimeSec, setCurrentTimeSec, currentFrameData, allTrajectories }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mapMode, setMapMode] = useState('base');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const videoUrl = "/annotated_junction67.mp4";
  const baseMapUrl = "/Map.jpeg";
  const heatmapUrl = "/HeatMap.jpeg";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Playback error:", err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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

    currentFrameData.detections.forEach((det) => {
      const scaleX = width / 1920;
      const scaleY = height / 1080;

      const cx = det.x * scaleX;
      const cy = det.y * scaleY;
      const color = CLASS_COLORS[det.class] || '#007AFF';

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
        ctx.globalAlpha = 0.75;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      const boxW = (det.width || 50) * scaleX;
      const boxH = (det.height || 80) * scaleY;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Label background for Light theme
      const label = `#${det.id} ${det.class} (${det.speed_kmh}km/h)`;
      ctx.font = 'bold 10px Inter, sans-serif';
      const textMetrics = ctx.measureText(label);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillRect(cx - boxW / 2, cy - boxH / 2 - 16, textMetrics.width + 8, 14);

      ctx.fillStyle = '#1c1c1e';
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
            <h2 className="text-sm font-bold text-slate-900">Camera Stream 01</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">1080p @ 30FPS</span>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group border border-slate-200 shadow-inner">
          <video
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            muted={isMuted}
            playsInline
            preload="auto"
            controls
            className="w-full h-full object-contain"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src="/api/video/stream" type="video/mp4" />
          </video>
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute p-4 rounded-full bg-white/80 backdrop-blur-md text-slate-900 border border-white/60 shadow-lg opacity-90 group-hover:opacity-100 transition-all hover:scale-105 pointer-events-auto"
            >
              <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
            </button>
          )}
        </div>

        {/* Video Scrubber & Controls */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors shadow-sm"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors shadow-sm"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-ios-accent" />}
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
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ios-accent"
          />
        </div>
      </div>

      {/* Right Pane: Interactive Map Viewer & Trajectory Overlay */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ios-indigo" />
            <h2 className="text-sm font-bold text-slate-900">GIS Trajectory Overlay</h2>
          </div>

          {/* Toggle Map Mode Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs shadow-inner">
            <button
              onClick={() => setMapMode('base')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                mapMode === 'base'
                  ? 'bg-ios-accent text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Base Map
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                mapMode === 'heatmap'
                  ? 'bg-ios-rose text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Risk Heatmap
            </button>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-inner">
          <img
            src={mapMode === 'base' ? baseMapUrl : heatmapUrl}
            alt="Intersection GIS Map"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-medium px-1">
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
