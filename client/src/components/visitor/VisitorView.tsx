import React from 'react';
import {
  Sparkles,
  Users,
  Compass,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';
import { NEARBY_PLACES } from '../../data/mockData';

export const VisitorView: React.FC = () => {
  const {
    settings,
    queues,
    counters,
    recommendedCounter,
    setViewMode,
    setActiveNav
  } = useQueueSight();

  const shortestWaitQueue = queues.find((q) => q.counterId === recommendedCounter?.id) || queues[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Return to Staff Desk Switcher Bar */}
      <div className="rounded-xl bg-navy-900 border border-navy-800 p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Smartphone className="w-4 h-4 text-teal-400" />
          <span>Currently previewing <strong>Visitor Mobile Screen</strong></span>
        </div>
        <button
          onClick={() => setViewMode('staff')}
          className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold transition-colors"
        >
          Return to Staff Desk
        </button>
      </div>

      {/* Visitor Welcome Header */}
      <div className="text-center space-y-1 py-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
          Visitor Navigator
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Welcome to {settings.locationName}
        </h1>
        <p className="text-xs text-slate-400">
          Real-time service counter wait times and step-free navigation
        </p>
      </div>

      {/* HERO CARD: Shortest Wait Recommendation */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-950/80 via-navy-900 to-navy-950 border-2 border-teal-400/60 p-6 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-400 text-navy-950 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Recommended Counter
          </span>
          <span className="text-xs font-mono text-teal-300">
            Updated just now
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            For the shortest estimated wait, join{' '}
            <span className="text-teal-400 underline decoration-teal-400/40">
              {recommendedCounter?.name || 'Counter 2'}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {recommendedCounter?.name || 'Counter 2'} is open and has the shortest estimated wait (approx{' '}
            {shortestWaitQueue?.estimatedWaitMinutes || 3} mins).
          </p>
        </div>

        {/* Step-Free Accessibility Route Box */}
        <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-teal-500/30 text-xs text-slate-200 space-y-1">
          <span className="font-bold text-teal-300 text-[11px] uppercase tracking-wider block">
            Step-Free Route Guidance:
          </span>
          <p className="leading-relaxed">
            Step-free route to {recommendedCounter?.name || 'Counter 2'} via East Ramp. Please keep the left-side walkway clear.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-navy-800 text-xs text-slate-400">
          <span>Counter Staff: {recommendedCounter?.assignedStaff || 'Marcus Vance'}</span>
          <span className="text-teal-400 font-semibold">{recommendedCounter?.specialty}</span>
        </div>
      </div>

      {/* Live Queues At a Glance */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <span>All Service Counters</span>
          </h3>
          <span className="text-[11px] text-slate-400 italic">Estimated wait times</span>
        </div>

        <div className="space-y-2.5">
          {queues.map((q) => {
            const matchedCounter = counters.find((c) => c.id === q.counterId);
            const isBest = matchedCounter?.id === recommendedCounter?.id;
            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isBest
                    ? 'bg-teal-500/10 border-teal-500/40'
                    : 'bg-navy-850 border-navy-750'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{q.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-navy-800 text-slate-300">
                      {matchedCounter?.name}
                    </span>
                    {isBest && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-400 text-navy-950 uppercase">
                        Fastest
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {q.personCount} people waiting anonymously
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-teal-300 block">
                    ~{q.estimatedWaitMinutes} mins
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {q.status} line
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* While You Wait / After Your Visit */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Explore Nearby & Plan Your Trip</span>
          </h3>
          <button
            onClick={() => {
              setViewMode('staff');
              setActiveNav('nearby');
            }}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
          >
            Open Explorer →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NEARBY_PLACES.slice(0, 2).map((place) => (
            <div
              key={place.id}
              className="p-3 rounded-xl bg-navy-850 border border-navy-750 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{place.name}</span>
                <span className="text-[10px] font-mono text-teal-400">{place.distanceMeters}m away</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{place.shortDescription}</p>
              <span className="text-[10px] text-emerald-400 block font-medium">{place.openingHours}</span>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-850 to-plum-950/60 border border-navy-750 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-white block">Next Stop: State Heritage Museum?</span>
            <span className="text-slate-400 text-[11px]">Bus 12 arrives in 6 mins at Campus Bay 2</span>
          </div>
          <button
            onClick={() => {
              setViewMode('staff');
              setActiveNav('nearby');
            }}
            className="px-3 py-1.5 rounded-lg bg-teal-500 text-navy-950 font-bold text-xs shrink-0"
          >
            View Bus Route
          </button>
        </div>
      </div>

      {/* Visitor Privacy Note */}
      <div className="text-center text-[11px] text-slate-500 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>QueueSight measures line counts anonymously. No video or biometric data is stored.</span>
        </p>
      </div>
    </div>
  );
};
