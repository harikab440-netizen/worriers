import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  MapPin,
  Eye
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';
import { ObstacleSeverity } from '@campus/shared';

export const AccessibilityAlertsView: React.FC = () => {
  const {
    alerts,
    resolveAlert,
    dismissAlert,
    triggerSimulatedAlert,
    setActiveNav
  } = useQueueSight();

  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [severityFilter, setSeverityFilter] = useState<'all' | ObstacleSeverity>('all');

  const filteredAlerts = alerts
    .filter((a) => (activeTab === 'active' ? a.status === 'active' : a.status === 'resolved'))
    .filter((a) => (severityFilter === 'all' ? true : a.severity === severityFilter));

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-coral-400" />
              <span>Accessibility & Walkway Obstacle Alerts</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-coral-500/20 text-coral-300 border border-coral-500/30">
              {activeCount} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Floor-level visual tracking identifies temporary obstructions (unattended luggage, stray chairs, stanchion bases) that compromise step-free wheelchair clearance or create tripping risks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => triggerSimulatedAlert()}
            className="px-3.5 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-coral-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate New Obstacle</span>
          </button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-teal-500 text-navy-950 font-bold'
                : 'bg-navy-850 text-slate-300 hover:bg-navy-800'
            }`}
          >
            <span>Active Hazards</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'active' ? 'bg-navy-900 text-teal-300' : 'bg-navy-750 text-slate-400'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'resolved'
                ? 'bg-teal-500 text-navy-950 font-bold'
                : 'bg-navy-850 text-slate-300 hover:bg-navy-800'
            }`}
          >
            <span>Resolved History</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'resolved' ? 'bg-navy-900 text-teal-300' : 'bg-navy-750 text-slate-400'
            }`}>
              {resolvedCount}
            </span>
          </button>
        </div>

        {/* Severity filter buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Severity:</span>
          </span>
          {(['all', 'high', 'medium', 'low'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize border transition-colors ${
                severityFilter === sev
                  ? 'bg-navy-750 border-teal-500/50 text-teal-300 font-bold'
                  : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid / List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="py-16 px-4 text-center rounded-2xl bg-navy-900/60 border border-navy-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {activeTab === 'active' ? 'Zero Active Walkway Hazards' : 'No Resolved Alerts Recorded'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                {activeTab === 'active'
                  ? 'Computer vision monitors show all corridors, ramps, and counter approaches meet 36-inch clearance guidelines.'
                  : 'Resolved alerts will show here with staff timestamps and verification details.'}
              </p>
            </div>
            {activeTab === 'active' && (
              <button
                onClick={() => triggerSimulatedAlert()}
                className="mt-2 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-teal-300 text-xs font-medium border border-navy-700"
              >
                Trigger a Test Hazard
              </button>
            )}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 shadow-lg transition-all ${
                alert.status === 'active'
                  ? alert.severity === 'high'
                    ? 'bg-navy-900 border-coral-500/40 ring-1 ring-coral-500/20'
                    : 'bg-navy-900 border-amber-500/40'
                  : 'bg-navy-900/60 border-navy-800 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base">{alert.obstacleType}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        alert.severity === 'high'
                          ? 'bg-coral-500 text-white'
                          : alert.severity === 'medium'
                          ? 'bg-amber-500 text-navy-950'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {alert.severity} Severity
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {alert.detectedTimeFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-teal-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Zone: {alert.zone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-850 border border-navy-750 text-xs text-slate-200 space-y-1">
                    <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider block">
                      Recommended Action:
                    </span>
                    <p className="leading-relaxed">{alert.suggestedAction}</p>
                  </div>

                  {alert.resolvedAt && (
                    <div className="text-xs text-slate-400 pt-1 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>
                        Resolved by {alert.resolvedBy || 'Staff'} at {new Date(alert.resolvedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                  <div className="text-right text-[11px] text-slate-400 font-mono hidden md:block">
                    Confidence: {alert.confidence}%
                  </div>

                  {alert.status === 'active' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs transition-colors shadow-sm"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 border border-navy-700 text-xs transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => setActiveNav('live')}
                        className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-teal-300 border border-navy-700 text-xs transition-colors flex items-center gap-1"
                        title="Inspect on live camera overlay"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Camera</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-teal-400 font-medium px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
