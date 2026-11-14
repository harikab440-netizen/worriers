import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Check,
  RefreshCw
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, playAudioChime, resetDemoScenario } = useQueueSight();
  const [locationInput, setLocationInput] = useState(settings.locationName);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveLocation = () => {
    if (locationInput.trim()) {
      updateSettings({ locationName: locationInput.trim() });
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings Title */}
      <div className="flex items-center justify-between pb-4 border-b border-navy-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-400" />
            <span>Station & Vision Preferences</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure service location identity, alert sensitivity, display ergonomics, and privacy policies
          </p>
        </div>
        {saveToast && (
          <div className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences saved!</span>
          </div>
        )}
      </div>

      {/* 1. Station Identity Configuration */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-slate-300">
          Service Desk Identity
        </h3>

        <div className="space-y-2 max-w-lg">
          <label className="text-xs text-slate-400 block font-medium">
            Displayed Location Name:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. Campus Help Desk, Civic Service Desk..."
              className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <button
              onClick={handleSaveLocation}
              disabled={!locationInput.trim() || locationInput === settings.locationName}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-navy-950 font-bold text-xs transition-colors shrink-0"
            >
              Update
            </button>
          </div>
          <span className="text-[11px] text-slate-500">
            This name appears in the top navigation, visitor guidance banners, and trip planning routes.
          </span>
        </div>
      </div>

      {/* 2. Simulation & Demo Mode Preferences */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-slate-300">
          Operation & Demo Mode
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-850 border border-navy-750">
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-white block">Demo Mode Simulation</span>
            <p className="text-[11px] text-slate-400">
              When live camera is unavailable, load stable synthetic queue and obstacle detections.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ demoMode: !settings.demoMode })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
              settings.demoMode ? 'bg-teal-500' : 'bg-navy-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.demoMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-850 border border-navy-750">
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-white block">Reset Demonstration Scenario</span>
            <p className="text-[11px] text-slate-400">
              Restore initial queue counts, counter assignments, and clear test obstacle alerts.
            </p>
          </div>
          <button
            onClick={resetDemoScenario}
            className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-amber-300 border border-navy-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 3. Alert & Audio Preferences */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-slate-300">
          Alerts & Audio Chimes
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-850 border border-navy-750">
            <div className="space-y-0.5">
              <span className="font-semibold text-xs text-white block">Synthesized Audio Chime</span>
              <p className="text-[11px] text-slate-400">
                Plays an audible web audio notification when a new walkway obstacle is detected.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={playAudioChime}
                className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-750 text-teal-300 text-xs font-medium border border-navy-700"
              >
                Test Sound
              </button>
              <button
                onClick={() => updateSettings({ soundAlerts: !settings.soundAlerts })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                  settings.soundAlerts ? 'bg-teal-500' : 'bg-navy-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.soundAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-850 border border-navy-750">
            <div className="space-y-0.5">
              <span className="font-semibold text-xs text-white block">Obstacle Detection Sensitivity</span>
              <p className="text-[11px] text-slate-400">
                Adjust spatial AI threshold for flagging bags or chairs as obstacles.
              </p>
            </div>
            <select
              value={settings.detectionSensitivity}
              onChange={(e) => updateSettings({ detectionSensitivity: e.target.value as any })}
              className="bg-navy-800 border border-navy-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="low">Low (Large hazards only)</option>
              <option value="medium">Medium (Standard recommended)</option>
              <option value="high">High (Maximum sensitivity)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Display Preferences */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-slate-300">
          Display & Currency
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1.5">
            <label className="font-semibold text-xs text-white block">Transit Currency Symbol</label>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value as any })}
              className="w-full bg-navy-950 border border-navy-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 space-y-1.5">
            <label className="font-semibold text-xs text-white block">Layout Density</label>
            <select
              value={settings.density}
              onChange={(e) => updateSettings({ density: e.target.value as any })}
              className="w-full bg-navy-950 border border-navy-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="comfortable">Comfortable (Spacious touch targets)</option>
              <option value="compact">Compact (High information density)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Privacy, Ethics & Computer Vision Charter */}
      <div className="rounded-2xl bg-gradient-to-br from-navy-900 via-navy-850 to-plum-950/70 border border-teal-500/30 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              QueueSight Privacy & Computer Vision Charter
            </h3>
            <p className="text-xs text-teal-300 font-medium">
              Zero Facial Recognition • Anonymous Headcount • Ephemeral Feeds
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed pt-2 border-t border-navy-800">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              <strong>Anonymous Spatial Tracking:</strong> The prototype counts people strictly by physical bounding silhouettes. It does not employ facial recognition, iris scanning, demographic profiling, or individual biometric tracking.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              <strong>Zero Video Storage:</strong> Live camera feeds and uploaded snapshots are processed ephemerally in volatile memory. No identifiable video recordings or visitor imagery are stored on disk or shared with third parties.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              <strong>Human Oversight:</strong> Service counter status changes and accessibility alert resolutions remain under the direct control of human station operators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
