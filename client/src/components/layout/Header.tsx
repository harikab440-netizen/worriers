import React, { useState } from 'react';
import {
  Eye,
  Camera,
  VideoOff,
  Radio,
  MapPin,
  Settings,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  Check
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    cameraStatus,
    cameraError,
    connectCamera,
    disconnectCamera,
    viewMode,
    setViewMode,
    setActiveNav,
    resetDemoScenario
  } = useQueueSight();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const locations = [
    'Campus Help Desk',
    'Student Services Center',
    'East Gate Terminal Desk',
    'Municipal Civic Hub',
    'University Hospital Triage'
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-navy-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Visual Mark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveNav('overview')}
              className="flex items-center gap-2.5 text-left group focus-visible:ring-teal-400 focus-visible:outline-none rounded-lg p-1"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-navy-800 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <Eye className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                    Queue<span className="text-teal-400">Sight</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 uppercase tracking-wider font-semibold">
                    CV v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                  Computer Vision & Visual Intelligence
                </p>
              </div>
            </button>

            {/* Current Location Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 border border-navy-750 text-xs font-medium text-slate-200 transition-colors"
                aria-expanded={locationDropdownOpen}
                aria-haspopup="true"
              >
                <MapPin className="w-3.5 h-3.5 text-coral-400 shrink-0" />
                <span className="max-w-[150px] truncate">{settings.locationName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-navy-900 border border-navy-750 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Service Location
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        updateSettings({ locationName: loc });
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        settings.locationName === loc
                          ? 'bg-teal-500/20 text-teal-300 font-semibold'
                          : 'text-slate-300 hover:bg-navy-800'
                      }`}
                    >
                      <span>{loc}</span>
                      {settings.locationName === loc && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Connection State Badge */}
            <div className="flex items-center">
              {cameraStatus === 'connected' ? (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Camera Connected</span>
                  <span className="sm:hidden">Live</span>
                </div>
              ) : cameraStatus === 'unavailable' ? (
                <div
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium cursor-help"
                  title={cameraError || 'Camera unavailable'}
                >
                  <VideoOff className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">Camera Unavailable</span>
                  <span className="sm:hidden">Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                  <Radio className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Demo Mode (Fictional Stream)</span>
                  <span className="sm:hidden">Demo</span>
                </div>
              )}
            </div>

            {/* Connect Camera Action Button */}
            {cameraStatus !== 'connected' ? (
              <button
                onClick={connectCamera}
                disabled={cameraStatus === 'requesting'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-navy-950 font-semibold text-xs transition-colors shadow-sm shadow-teal-500/20 disabled:opacity-60"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">
                  {cameraStatus === 'requesting' ? 'Connecting...' : 'Connect Camera'}
                </span>
                <span className="xs:hidden">Connect</span>
              </button>
            ) : (
              <button
                onClick={disconnectCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 border border-navy-750 text-xs transition-colors"
                title="Disconnect webcam and return to Demo Mode"
              >
                <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            )}

            {/* View Mode Toggle: Staff Dashboard vs Visitor Mobile View */}
            <div className="hidden lg:flex items-center bg-navy-900 border border-navy-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode('staff')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'staff'
                    ? 'bg-navy-750 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Staff Desk
              </button>
              <button
                onClick={() => setViewMode('visitor')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  viewMode === 'visitor'
                    ? 'bg-navy-750 text-teal-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3 h-3 text-teal-400" />
                <span>Visitor View</span>
              </button>
            </div>

            {/* Profile / Quick Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-plum-700 to-teal-600 p-0.5 hover:ring-2 hover:ring-teal-400/50 transition-all flex items-center justify-center focus-visible:outline-none"
                aria-label="Staff profile and settings"
              >
                <div className="w-full h-full bg-navy-900 rounded-full flex items-center justify-center text-xs font-semibold text-teal-300">
                  QS
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-navy-900 border border-navy-750 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-navy-800 mb-1">
                    <p className="text-xs font-semibold text-white">Campus Staff Operator</p>
                    <p className="text-[11px] text-slate-400">Desk Station #2 • General Service</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-teal-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Privacy Active: Anonymous Counting</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setViewMode(viewMode === 'staff' ? 'visitor' : 'staff');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-navy-800 text-slate-200 flex items-center gap-2"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                      <span>Switch to {viewMode === 'staff' ? 'Visitor Preview' : 'Staff Dashboard'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveNav('settings');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-navy-800 text-slate-200 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Application Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        resetDemoScenario();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-navy-800 text-amber-300 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
