import React from 'react';
import {
  LayoutDashboard,
  Video,
  Users,
  AlertTriangle,
  Compass,
  Activity,
  Settings
} from 'lucide-react';
import { useQueueSight, NavTab } from '../../context/QueueSightContext';

interface NavItem {
  id: NavTab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: number;
}

export const Navigation: React.FC = () => {
  const { activeNav, setActiveNav, activeObstaclesCount } = useQueueSight();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      shortLabel: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'live',
      label: 'Live Area',
      shortLabel: 'Live View',
      icon: Video
    },
    {
      id: 'queues',
      label: 'Queues & Counters',
      shortLabel: 'Queues',
      icon: Users
    },
    {
      id: 'accessibility',
      label: 'Accessibility Alerts',
      shortLabel: 'Alerts',
      icon: AlertTriangle,
      badge: activeObstaclesCount > 0 ? activeObstaclesCount : undefined
    },
    {
      id: 'nearby',
      label: 'Nearby & Explore',
      shortLabel: 'Explore',
      icon: Compass
    },
    {
      id: 'activity',
      label: 'Activity',
      shortLabel: 'Activity',
      icon: Activity
    },
    {
      id: 'settings',
      label: 'Settings',
      shortLabel: 'Settings',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Desktop & Tablet Subheader Navigation */}
      <nav aria-label="Main Navigation" className="bg-navy-900 border-b border-navy-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 lg:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 focus-visible:ring-teal-400 focus-visible:outline-none ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800 border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-coral-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Fixed, Touch-friendly) */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-navy-800 md:hidden py-1.5 px-2">
        <div className="grid grid-cols-7 gap-1 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors relative ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-coral-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-[48px] text-center mt-0.5 leading-tight">
                  {item.shortLabel}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-4 h-0.5 bg-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
