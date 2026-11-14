import React, { useState } from 'react';
import {
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';

export const ActivityView: React.FC = () => {
  const { activity } = useQueueSight();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivity = activity.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Confidence Metrics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Explanatory card */}
        <div className="lg:col-span-2 rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">Visual Intelligence Activity & Audit Feed</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every queue count adjustment, operational counter shift, obstacle detection, and staff resolution is logged in real-time. Detections use cautious optical thresholds and explainable confidence scoring.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Optical Confidence</span>
              <span className="text-xl font-extrabold text-teal-400 mt-0.5 block">93.4%</span>
              <span className="text-[10px] text-slate-400">Within ±1 person tolerance</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vision Model</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Gemini 3.8 + Spatial CV</span>
              <span className="text-[10px] text-slate-400">Zero Facial Recognition</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Staff Interventions</span>
              <span className="text-xl font-extrabold text-amber-400 mt-0.5 block">
                {activity.filter((a) => a.type === 'resolution').length} Actions
              </span>
              <span className="text-[10px] text-slate-400">Human in control</span>
            </div>
          </div>
        </div>

        {/* Right: Cautious Labeling Notice */}
        <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-teal-500/20 p-5 shadow-lg space-y-2.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Accuracy & Ethical CV Standard
            </span>
            <h3 className="font-bold text-sm text-white mt-1">Cautious Visual Labeling</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              QueueSight strictly employs cautious terminologies: “estimated count”, “possible obstacle”, and “inferred status”. Sudden lighting shifts or crowd overlap may introduce small variance.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-800 text-[11px] text-slate-400">
            Staff members remain final decision-makers on service lane flow and hazard clearance.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-navy-800">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'queue', label: 'Queue Shifts' },
          { id: 'counter', label: 'Counter Changes' },
          { id: 'obstacle', label: 'Obstacle Detections' },
          { id: 'resolution', label: 'Resolutions' },
          { id: 'system', label: 'System Logs' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-teal-500 text-navy-950 font-bold'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filteredActivity.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-navy-900 border border-navy-800 text-slate-400 text-xs">
            No events found for this filter category.
          </div>
        ) : (
          filteredActivity.map((act) => {
            const isObstacle = act.type === 'obstacle';
            const isResolution = act.type === 'resolution';
            const isCounter = act.type === 'counter';

            return (
              <div
                key={act.id}
                className={`rounded-2xl border p-4 shadow-md transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  isObstacle
                    ? 'bg-navy-900 border-coral-500/30'
                    : isResolution
                    ? 'bg-navy-900 border-teal-500/30'
                    : 'bg-navy-900 border-navy-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isObstacle
                      ? 'bg-coral-500/15 text-coral-400'
                      : isResolution
                      ? 'bg-teal-500/15 text-teal-400'
                      : isCounter
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-navy-800 text-slate-300'
                  }`}>
                    {isObstacle ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : isResolution ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCounter ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{act.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-navy-850 text-slate-400 border border-navy-750">
                        {act.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                    {act.confidenceText && (
                      <p className="text-[11px] text-teal-300/80 font-mono">
                        {act.confidenceText}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-right">
                  {act.confidenceScore && (
                    <span className="text-[11px] font-mono font-bold text-slate-300 bg-navy-850 px-2 py-0.5 rounded border border-navy-750">
                      {act.confidenceScore}% conf
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-mono">{act.timeFormatted}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
