import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Video,
  Eye,
  Info
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';

export const OverviewView: React.FC = () => {
  const {
    totalPeopleWaiting,
    openCountersCount,
    averageWaitMinutes,
    activeObstaclesCount,
    recommendedCounter,
    queues,
    counters,
    alerts,
    activity,
    setActiveNav,
    triggerSimulatedAlert,
    simulateQueueChange,
    resolveAlert,
    cameraStatus
  } = useQueueSight();

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <div className="space-y-6">
      {/* Demo Mode / Estimation Disclosure Banner */}
      <div className="rounded-xl bg-navy-900/80 border border-navy-750 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100">
                Visual Intelligence Active
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {cameraStatus === 'connected' ? 'Live Stream' : 'Demo Simulation Mode'}
              </span>
            </div>
            <p className="text-slate-400 mt-0.5">
              All people counts and wait times are estimated anonymously using spatial computer vision models. No personal or facial data is recorded.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveNav('live')}
            className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-teal-400" />
            <span>Open Live Camera</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total People Waiting */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg relative overflow-hidden group hover:border-navy-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total People Waiting
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalPeopleWaiting}
            </span>
            <span className="text-xs text-slate-400 font-medium">people</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-navy-800/80">
            <span className="text-teal-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Anonymous estimate
            </span>
            <span className="text-slate-400">Across 4 queues</span>
          </div>
        </div>

        {/* Metric 2: Open Counters */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg relative overflow-hidden group hover:border-navy-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Open Counters
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {openCountersCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">of {counters.length} Active</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-navy-800/80">
            <span className="text-emerald-400 font-medium">
              {counters.filter((c) => c.status === 'busy').length} currently serving
            </span>
            <span className="text-slate-400">
              {counters.filter((c) => c.status === 'closed').length} closed
            </span>
          </div>
        </div>

        {/* Metric 3: Estimated Average Wait Time */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg relative overflow-hidden group hover:border-navy-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Est. Average Wait
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {averageWaitMinutes}
            </span>
            <span className="text-xs text-slate-400 font-medium">minutes</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-navy-800/80">
            <span className="text-amber-300 font-medium">
              Shortest: {Math.min(...queues.map((q) => q.estimatedWaitMinutes))} mins
            </span>
            <span className="text-slate-400">Throughput: ~2m/p</span>
          </div>
        </div>

        {/* Metric 4: Walkway Obstacles / Accessibility Alerts */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg relative overflow-hidden group hover:border-navy-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Walkway Obstacles
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              activeObstaclesCount > 0
                ? 'bg-coral-500/10 border border-coral-500/20 text-coral-400'
                : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${
              activeObstaclesCount > 0 ? 'text-coral-400' : 'text-teal-400'
            }`}>
              {activeObstaclesCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {activeObstaclesCount === 1 ? 'hazard flagged' : 'hazards flagged'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-navy-800/80">
            <span className={activeObstaclesCount > 0 ? 'text-coral-300 font-medium' : 'text-teal-300 font-medium'}>
              {activeObstaclesCount > 0 ? 'Action required' : 'All walkways clear'}
            </span>
            <button
              onClick={() => setActiveNav('accessibility')}
              className="text-slate-400 hover:text-white underline underline-offset-2"
            >
              Review alerts
            </button>
          </div>
        </div>
      </div>

      {/* Visitor Guidance & Recommendation Preview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-plum-950/80 border border-teal-500/30 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-500 text-navy-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Visitor Guidance Preview
              </span>
              <span className="text-xs text-slate-400">Live Navigation Recommendation</span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>For the shortest estimated wait, join</span>
              <span className="text-teal-400 underline decoration-teal-500/50 underline-offset-4">
                {recommendedCounter?.name || 'Counter 2'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              “{recommendedCounter?.name || 'Counter 2'} is open and has the shortest estimated wait (approx{' '}
              {queues.find((q) => q.counterId === recommendedCounter?.id)?.estimatedWaitMinutes || 3}{' '}
              mins). Step-free route available via East Ramp. Please keep the left-side corridor clear.”
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveNav('queues')}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-500/20"
            >
              <span>Manage Queues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveNav('accessibility')}
              className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 text-xs font-semibold transition-colors"
            >
              Step-Free Routes
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queues & Counters Status (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Queues Card */}
          <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div>
                <h3 className="font-bold text-base text-white">Live Queues Breakdown</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Computer vision estimates people waiting in each designated lane
                </p>
              </div>
              <button
                onClick={() => setActiveNav('queues')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
              >
                <span>Full queue view</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {queues.map((q) => {
                const assignedCounter = counters.find((c) => c.id === q.counterId);
                const isShortest = q.id === (queues.slice().sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes)[0]?.id);
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl p-3.5 border transition-all ${
                      isShortest && assignedCounter?.status === 'open'
                        ? 'bg-teal-500/5 border-teal-500/30 ring-1 ring-teal-500/20'
                        : 'bg-navy-850/60 border-navy-750'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{q.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
                            {assignedCounter?.name || q.counterName}
                          </span>
                          {isShortest && assignedCounter?.status === 'open' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500 text-navy-950 uppercase tracking-wide">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Throughput: {q.throughput}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {q.trend === 'decreasing' ? (
                              <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
                            ) : q.trend === 'increasing' ? (
                              <TrendingUp className="w-3.5 h-3.5 text-coral-400" />
                            ) : (
                              <Minus className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className="capitalize">{q.trend}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right shrink-0">
                        <div>
                          <div className="text-lg font-bold text-white leading-tight">
                            {q.personCount} <span className="text-xs font-normal text-slate-400">people</span>
                          </div>
                          <div className="text-xs text-slate-400">
                            ~{q.estimatedWaitMinutes}m wait
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            q.status === 'short'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : q.status === 'moderate'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-coral-500/20 text-coral-300 border border-coral-500/30'
                          }`}
                        >
                          {q.status}
                        </span>

                        {/* Quick adjust simulation buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => simulateQueueChange(q.id, -1)}
                            disabled={q.personCount === 0}
                            className="w-7 h-7 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center font-bold text-sm disabled:opacity-40"
                            title="Simulate person serviced (-1)"
                          >
                            -
                          </button>
                          <button
                            onClick={() => simulateQueueChange(q.id, 1)}
                            className="w-7 h-7 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center font-bold text-sm"
                            title="Simulate person arrived (+1)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for queue load */}
                    <div className="mt-3 w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          q.status === 'short'
                            ? 'bg-teal-500'
                            : q.status === 'moderate'
                            ? 'bg-amber-500'
                            : 'bg-coral-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(8, (q.personCount / 8) * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accessibility Obstacles Alert Preview */}
          <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${
                  activeAlerts.length > 0 ? 'bg-coral-500/20 text-coral-400' : 'bg-teal-500/20 text-teal-400'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Active Walkway Hazards</h3>
                  <p className="text-xs text-slate-400">
                    Obstacles detected by floor cameras that may impede wheelchairs or strollers
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerSimulatedAlert()}
                className="text-xs px-2.5 py-1 rounded-lg bg-coral-500/15 hover:bg-coral-500/25 text-coral-300 border border-coral-500/30 font-medium transition-colors"
                title="Test obstacle alert simulation"
              >
                + Test Detect Obstacle
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-6 px-4 rounded-xl bg-navy-850/40 border border-dashed border-navy-750">
                  <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-200">All Walkways Are Clear</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Vision cameras report zero detected obstacles in ramps or corridors.
                  </p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl bg-navy-850 border border-coral-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{alert.obstacleType}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-coral-500/20 text-coral-300 border border-coral-500/40">
                          {alert.severity} Severity
                        </span>
                        <span className="text-xs text-slate-400">
                          {alert.detectedTimeFormatted}
                        </span>
                      </div>
                      <p className="text-xs text-teal-300 font-medium">Zone: {alert.zone}</p>
                      <p className="text-xs text-slate-300">{alert.suggestedAction}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-navy-950 font-semibold text-xs transition-colors"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => setActiveNav('live')}
                        className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Snapshot & Recent Activity Feed */}
        <div className="space-y-6">
          {/* Mini Live Area Snapshot Widget */}
          <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-400" />
                <span>Live Area Camera</span>
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                {cameraStatus === 'connected' ? 'LIVE' : 'DEMO'}
              </span>
            </div>

            {/* Visual Mini Frame */}
            <div
              onClick={() => setActiveNav('live')}
              className="relative aspect-video rounded-xl bg-navy-950 border border-navy-750 overflow-hidden cursor-pointer group hover:border-teal-500/40 transition-all shadow-inner"
            >
              {/* Simulated Hall Graphic */}
              <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 to-navy-950 flex flex-col justify-between p-3">
                {/* Counter Zone markers */}
                <div className="flex justify-around items-center pt-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    C1: OPEN
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    C2: OPEN
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    C3: BUSY
                  </span>
                </div>

                {/* Queue Detections Graphic */}
                <div className="flex justify-around items-end pb-3">
                  <div className="w-10 h-16 border border-dashed border-teal-400/50 rounded flex items-center justify-center text-[10px] text-teal-300 bg-teal-500/10">
                    Q1 (4)
                  </div>
                  <div className="w-10 h-14 border border-dashed border-teal-400/50 rounded flex items-center justify-center text-[10px] text-teal-300 bg-teal-500/10">
                    Q2 (1)
                  </div>
                  <div className="w-10 h-20 border border-dashed border-amber-400/50 rounded flex items-center justify-center text-[10px] text-amber-300 bg-amber-500/10">
                    Q3 (6)
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-teal-500 text-navy-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Expand Live Area</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Model Confidence: 94%</span>
              <button
                onClick={() => setActiveNav('live')}
                className="text-teal-400 hover:text-teal-300 font-medium"
              >
                Upload image to analyze →
              </button>
            </div>
          </div>

          {/* Recent Activity Mini Feed */}
          <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="font-bold text-sm text-white">Recent System Events</h3>
              <button
                onClick={() => setActiveNav('activity')}
                className="text-xs text-teal-400 hover:text-teal-300"
              >
                View all
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {activity.slice(0, 4).map((act) => (
                <div key={act.id} className="text-xs space-y-0.5 pb-2.5 border-b border-navy-800/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{act.title}</span>
                    <span className="text-[10px] text-slate-500">{act.timeFormatted}</span>
                  </div>
                  <p className="text-slate-400 line-clamp-1">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
