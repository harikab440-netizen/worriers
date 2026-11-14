import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Upload,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  X,
  Sparkles,
  Info,
  FileImage
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';

export const LiveAreaView: React.FC = () => {
  const {
    cameraStatus,
    cameraStream,
    cameraError,
    connectCamera,
    availableCameras,
    selectedCameraId,
    selectCamera,
    isFeedPaused,
    toggleFeedPause,
    feedLayers,
    toggleFeedLayer,
    queues,
    counters,
    alerts,
    uploadedImage,
    uploadedFileName,
    isAnalyzingImage,
    imageAnalysisResult,
    uploadAndAnalyzeImage,
    clearUploadedImage,
    simulateQueueChange,
    toggleCounterStatus,
    triggerSimulatedAlert,
    resetDemoScenario
  } = useQueueSight();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Bind media stream to video element
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => console.warn('Video auto-play hindered:', err));
    }
  }, [cameraStream, cameraStatus]);

  // Fullscreen handlers
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        uploadAndAnalyzeImage(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadAndAnalyzeImage(file);
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <div className="space-y-6">
      {/* Camera permission denied or error notification */}
      {cameraError && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs text-amber-300 flex items-start justify-between gap-3 shadow-md">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Camera Access Note: </span>
              <span>{cameraError}</span>
              <p className="text-slate-400 mt-1">
                You can continue seamlessly with clearly labeled <strong>Demo Footage</strong> or drag and drop a snapshot into the Image Analyzer below.
              </p>
            </div>
          </div>
          <button
            onClick={() => connectCamera()}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold shrink-0"
          >
            Retry Permission
          </button>
        </div>
      )}

      {/* Top Controls & Feed Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 border border-navy-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Service Hall Visual Feed</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                cameraStatus === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cameraStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{cameraStatus === 'connected' ? 'Live Camera Feed' : 'Demo Footage (Fictional Stream)'}</span>
            </span>
          </div>

          {/* Camera Selection Dropdown */}
          {availableCameras.length > 0 && cameraStatus === 'connected' && (
            <select
              value={selectedCameraId}
              onChange={(e) => selectCamera(e.target.value)}
              className="bg-navy-800 border border-navy-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              {availableCameras.map((cam, idx) => (
                <option key={cam.deviceId || idx} value={cam.deviceId}>
                  {cam.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Video Overlay Layer Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden lg:inline">Overlays:</span>
          <button
            onClick={() => toggleFeedLayer('queues')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              feedLayers.queues
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                : 'bg-navy-800 border-navy-700 text-slate-400'
            }`}
          >
            Queues
          </button>
          <button
            onClick={() => toggleFeedLayer('counters')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              feedLayers.counters
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-navy-800 border-navy-700 text-slate-400'
            }`}
          >
            Counters
          </button>
          <button
            onClick={() => toggleFeedLayer('obstacles')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              feedLayers.obstacles
                ? 'bg-coral-500/20 border-coral-500/40 text-coral-300'
                : 'bg-navy-800 border-navy-700 text-slate-400'
            }`}
          >
            Obstacles ({activeAlerts.length})
          </button>
        </div>
      </div>

      {/* Main Large Visual Camera Preview Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] min-h-[380px] max-h-[620px] rounded-3xl bg-navy-950 border border-navy-800 overflow-hidden shadow-2xl flex items-center justify-center select-none"
      >
        {/* Real video element if webcam connected */}
        {cameraStatus === 'connected' && (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover transition-opacity duration-300 ${isFeedPaused ? 'opacity-40' : 'opacity-100'}`}
          />
        )}

        {/* Simulated Camera Scene Placeholder when no camera is connected or in Demo Mode */}
        {cameraStatus !== 'connected' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1220] via-[#090d18] to-[#060910] overflow-hidden">
            {/* Grid Floor Lines (Architectural perspective simulation) */}
            <svg className="w-full h-full opacity-25" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Vanishing lines */}
              <line x1="500" y1="180" x2="0" y2="600" stroke="#1e293b" strokeWidth="2" />
              <line x1="500" y1="180" x2="250" y2="600" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="500" y1="180" x2="500" y2="600" stroke="#1e293b" strokeWidth="1" />
              <line x1="500" y1="180" x2="750" y2="600" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="500" y1="180" x2="1000" y2="600" stroke="#1e293b" strokeWidth="2" />
              {/* Horizontal depth markers */}
              <line x1="100" y1="260" x2="900" y2="260" stroke="#1e293b" strokeWidth="1" />
              <line x1="50" y1="360" x2="950" y2="360" stroke="#1e293b" strokeWidth="1" />
              <line x1="0" y1="480" x2="1000" y2="480" stroke="#1e293b" strokeWidth="1.5" />
            </svg>

            {/* Service Desk Stations Background Graphic */}
            <div className="absolute top-[18%] left-[10%] right-[10%] h-[12%] bg-navy-900/90 border-t-2 border-teal-500/60 rounded-t-lg flex items-center justify-around px-4 shadow-lg">
              <span className="text-[11px] font-mono text-slate-400">COUNTER DESK 1</span>
              <span className="text-[11px] font-mono text-teal-300 font-bold">COUNTER DESK 2 (EXPRESS)</span>
              <span className="text-[11px] font-mono text-slate-400">COUNTER DESK 3</span>
              <span className="text-[11px] font-mono text-slate-500">COUNTER DESK 4 (CLOSED)</span>
            </div>
          </div>
        )}

        {/* Computer Vision Detection Overlays (SVG coordinate space 0-100%) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 1. Counter Detections */}
          {feedLayers.counters &&
            counters.map((c) => (
              <div
                key={c.id}
                style={{
                  left: `${c.bbox[0]}%`,
                  top: `${c.bbox[1]}%`,
                  width: `${c.bbox[2]}%`,
                  height: `${c.bbox[3]}%`
                }}
                className={`absolute rounded-xl border-2 transition-all flex flex-col justify-between p-1.5 ${
                  c.status === 'open'
                    ? 'border-emerald-500/80 bg-emerald-500/10'
                    : c.status === 'busy'
                    ? 'border-amber-500/80 bg-amber-500/10'
                    : 'border-slate-600/60 bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-navy-950/90 text-white">
                    {c.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      c.status === 'open'
                        ? 'bg-emerald-500 text-navy-950'
                        : c.status === 'busy'
                        ? 'bg-amber-500 text-navy-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-slate-300 bg-navy-950/80 px-1 py-0.5 rounded truncate">
                  {c.assignedStaff}
                </div>
              </div>
            ))}

          {/* 2. Queue Person Clusters */}
          {feedLayers.queues &&
            queues.map((q) => (
              <div
                key={q.id}
                style={{
                  left: `${q.bbox[0]}%`,
                  top: `${q.bbox[1]}%`,
                  width: `${q.bbox[2]}%`,
                  height: `${q.bbox[3]}%`
                }}
                className={`absolute rounded-2xl border-2 border-dashed transition-all flex flex-col justify-between p-2 ${
                  q.status === 'short'
                    ? 'border-teal-400 bg-teal-500/10'
                    : q.status === 'moderate'
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-coral-400 bg-coral-500/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-navy-950/90 text-teal-300">
                    {q.name.split(' - ')[0]}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-navy-950/90 text-white">
                    ~{q.estimatedWaitMinutes}m
                  </span>
                </div>

                {/* Simulated Person Figures inside queue */}
                <div className="flex flex-col items-center gap-1 my-auto">
                  {Array.from({ length: Math.min(q.personCount, 6) }).map((_, pIdx) => (
                    <div
                      key={pIdx}
                      className="w-5 h-5 rounded-full border border-teal-300/80 bg-teal-500/30 flex items-center justify-center text-[9px] font-mono text-white shadow-sm"
                    >
                      👤
                    </div>
                  ))}
                  {q.personCount > 6 && (
                    <span className="text-[9px] font-bold text-white bg-navy-900/90 px-1 rounded">
                      +{q.personCount - 6} more
                    </span>
                  )}
                </div>

                <div className="text-center text-[10px] font-bold text-navy-950 bg-teal-400 rounded py-0.5">
                  Est. {q.personCount} Waiting
                </div>
              </div>
            ))}

          {/* 3. Obstacle Hazards */}
          {feedLayers.obstacles &&
            activeAlerts.map((obs) => (
              <div
                key={obs.id}
                style={{
                  left: `${obs.bbox[0]}%`,
                  top: `${obs.bbox[1]}%`,
                  width: `${obs.bbox[2]}%`,
                  height: `${obs.bbox[3]}%`
                }}
                className="absolute rounded-xl border-2 border-coral-500 bg-coral-500/20 p-1.5 flex flex-col justify-between animate-pulse shadow-lg shadow-coral-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-coral-600 text-white flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    POSSIBLE OBSTACLE
                  </span>
                  <span className="text-[9px] font-mono bg-navy-950/90 text-coral-300 px-1 rounded">
                    {obs.confidence}%
                  </span>
                </div>
                <div className="text-[10px] font-bold text-white bg-navy-950/90 px-1.5 py-0.5 rounded truncate">
                  {obs.obstacleType}
                </div>
              </div>
            ))}
        </div>

        {/* Video Controls Bar Floating on Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-navy-950/85 backdrop-blur-md border border-navy-750 px-4 py-2.5 rounded-xl z-20 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFeedPause}
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white transition-colors"
              title={isFeedPaused ? 'Resume video stream' : 'Pause video stream'}
            >
              {isFeedPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
            <span className="font-mono text-slate-300 text-[11px]">
              FPS: 30.0 • RES: 1080p • CONFIDENCE: 94%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drag & Drop Image Upload & Vision Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Zone Card */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileImage className="w-4 h-4 text-teal-400" />
                <span>Upload Snapshot for Vision Analysis</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload a camera snapshot or floor photo to analyze queues, counters, and hazards.
              </p>
            </div>
            {uploadedImage && (
              <button
                onClick={clearUploadedImage}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Dropzone Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-teal-400 bg-teal-500/10'
                : uploadedImage
                ? 'border-navy-700 bg-navy-850/50'
                : 'border-navy-750 hover:border-teal-500/50 bg-navy-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {uploadedImage ? (
              <div className="space-y-3">
                <div className="relative max-h-48 rounded-xl overflow-hidden inline-block border border-navy-700 shadow-md">
                  <img
                    src={uploadedImage}
                    alt="Uploaded area snapshot"
                    className="max-h-48 object-contain rounded-xl"
                  />
                  {isAnalyzingImage && (
                    <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center gap-2 text-teal-400 font-semibold text-xs">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running Visual Intelligence...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                  <span className="font-mono text-slate-400">{uploadedFileName}</span>
                  <span>•</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-teal-400 hover:underline font-semibold"
                  >
                    Replace Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Drag and drop a photo here, or <span className="text-teal-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PNG, JPG, WebP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Uploaded images are processed in-memory for spatial analytics and discarded immediately.</span>
          </div>
        </div>

        {/* Snapshot Analysis Results Card */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Visual Intelligence Findings</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-800 text-slate-300">
                {imageAnalysisResult?.source === 'gemini_vision' ? 'Gemini 3.8 Flash' : 'Spatial CV Pipeline'}
              </span>
            </div>

            {imageAnalysisResult ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
                    <span className="text-[11px] text-slate-400">Total People Detected</span>
                    <p className="text-xl font-bold text-white mt-1">
                      {imageAnalysisResult.totalPeopleWaiting}{' '}
                      <span className="text-xs font-normal text-slate-400">anonymously</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
                    <span className="text-[11px] text-slate-400">Detection Confidence</span>
                    <p className="text-xl font-bold text-teal-400 mt-1">
                      {imageAnalysisResult.confidenceScore}%
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-850 border border-navy-750 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-300">Model Assessment:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {imageAnalysisResult.confidenceExplanation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">
                    Shortest Queue Recommendation:
                  </span>
                  <p className="text-xs text-slate-200">
                    {imageAnalysisResult.recommendation?.reason || 'Counter 2 is open with shortest wait.'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {imageAnalysisResult.recommendation?.stepFreeRouteGuidance}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Info className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs">
                  Upload an image snapshot on the left to view automated queue counts, counter statuses, and walkway obstacle detections.
                </p>
              </div>
            )}
          </div>

          {/* Quick Demo Controls Toolbar */}
          <div className="pt-4 border-t border-navy-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Staff Live Simulation Controls:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => simulateQueueChange('queue-1', 1)}
                className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 text-xs font-medium"
              >
                +1 Queue 1
              </button>
              <button
                onClick={() => simulateQueueChange('queue-2', -1)}
                className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 text-xs font-medium"
              >
                -1 Queue 2
              </button>
              <button
                onClick={() => toggleCounterStatus('counter-2')}
                className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 text-xs font-medium"
              >
                Toggle Counter 2
              </button>
              <button
                onClick={() => triggerSimulatedAlert()}
                className="px-2.5 py-1.5 rounded-lg bg-coral-500/20 hover:bg-coral-500/30 text-coral-300 border border-coral-500/30 text-xs font-medium"
              >
                Simulate Obstacle
              </button>
              <button
                onClick={resetDemoScenario}
                className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-amber-300 border border-navy-700 text-xs font-medium"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
