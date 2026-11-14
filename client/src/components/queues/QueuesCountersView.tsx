import React from 'react';
import {
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';

export const QueuesCountersView: React.FC = () => {
  const {
    queues,
    counters,
    recommendedCounter,
    simulateQueueChange,
    toggleCounterStatus
  } = useQueueSight();

  const totalPeopleWaiting = queues.reduce((sum, q) => sum + q.personCount, 0);

  return (
    <div className="space-y-6">
      {/* Shortest Queue Recommendation Callout Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-950/60 via-navy-900 to-navy-850 border border-teal-500/40 p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500 text-navy-950 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Shortest Suitable Queue
              </span>
              <span className="text-xs text-slate-400">Automated Visual Dispatch</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {recommendedCounter?.name || 'Counter 2'} is open and has the shortest estimated wait.
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Based on anonymous line density and service completion velocity, visitors are directed to{' '}
              <strong className="text-teal-300">{recommendedCounter?.name}</strong> (~
              {queues.find((q) => q.counterId === recommendedCounter?.id)?.estimatedWaitMinutes || 3} mins est. wait).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 italic">
              Wait times are real-time visual estimates
            </span>
          </div>
        </div>
      </div>

      {/* Two Grid Sections: Queues (Left) and Counters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Queue Statuses */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Service Queues</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Anonymous optical estimation of visitor lines
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-navy-800 text-slate-300">
              Total: {totalPeopleWaiting} waiting
            </span>
          </div>

          <div className="space-y-3">
            {queues.map((q) => {
              const assignedCounter = counters.find((c) => c.id === q.counterId);
              return (
                <div
                  key={q.id}
                  className="rounded-xl bg-navy-850 border border-navy-750 p-4 space-y-3 hover:border-navy-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{q.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-800 text-teal-300 border border-navy-700">
                          {assignedCounter?.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Throughput: {q.throughput} • Trend: {q.trend}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          q.status === 'short'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : q.status === 'moderate'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-coral-500/20 text-coral-300 border border-coral-500/30'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-navy-800">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Anonymous Count</span>
                        <span className="font-bold text-white text-base">
                          {q.personCount} <span className="text-xs font-normal text-slate-400">waiting</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Est. Wait</span>
                        <span className="font-bold text-teal-300 text-base">
                          ~{q.estimatedWaitMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
                        </span>
                      </div>
                    </div>

                    {/* Simulation buttons */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Simulate:</span>
                      <button
                        onClick={() => simulateQueueChange(q.id, -1)}
                        disabled={q.personCount === 0}
                        className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-sm disabled:opacity-40 flex items-center justify-center transition-colors"
                        title="Simulate 1 person serviced"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => simulateQueueChange(q.id, 1)}
                        className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors"
                        title="Simulate 1 person joined line"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Counter Statuses */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Service Counters Status</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff stations with real-time operational status
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {counters.filter((c) => c.status === 'open').length} Open
            </span>
          </div>

          <div className="space-y-3">
            {counters.map((c) => (
              <div
                key={c.id}
                className="rounded-xl bg-navy-850 border border-navy-750 p-4 space-y-3 hover:border-navy-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{c.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          c.status === 'open'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : c.status === 'busy'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Staff: <span className="text-slate-200">{c.assignedStaff}</span> • Specialty: {c.specialty}
                    </p>
                  </div>

                  {/* Staff Toggle Action Button */}
                  <button
                    onClick={() => toggleCounterStatus(c.id)}
                    className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 text-xs font-semibold shrink-0 transition-colors"
                    title="Cycle through Open -> Busy -> Closed"
                  >
                    Change State
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-navy-800 text-slate-400">
                  <span>Avg Consultation: {c.avgServiceMinutes} mins</span>
                  <span>
                    Assigned: {queues.find((q) => q.id === c.queueId)?.name || 'General Service'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
