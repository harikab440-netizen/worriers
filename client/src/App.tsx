import React from 'react';
import { QueueSightProvider, useQueueSight } from './context/QueueSightContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { OverviewView } from './components/overview/OverviewView';
import { LiveAreaView } from './components/live/LiveAreaView';
import { QueuesCountersView } from './components/queues/QueuesCountersView';
import { AccessibilityAlertsView } from './components/alerts/AccessibilityAlertsView';
import { NearbyExploreView } from './components/nearby/NearbyExploreView';
import { ActivityView } from './components/activity/ActivityView';
import { SettingsView } from './components/settings/SettingsView';
import { VisitorView } from './components/visitor/VisitorView';

const MainContent: React.FC = () => {
  const { activeNav, viewMode } = useQueueSight();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      {viewMode === 'visitor' ? (
        <VisitorView />
      ) : (
        <>
          {activeNav === 'overview' && <OverviewView />}
          {activeNav === 'live' && <LiveAreaView />}
          {activeNav === 'queues' && <QueuesCountersView />}
          {activeNav === 'accessibility' && <AccessibilityAlertsView />}
          {activeNav === 'nearby' && <NearbyExploreView />}
          {activeNav === 'activity' && <ActivityView />}
          {activeNav === 'settings' && <SettingsView />}
        </>
      )}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <QueueSightProvider>
      <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-navy-950">
        <Header />
        <Navigation />
        <div className="flex-1">
          <MainContent />
        </div>
      </div>
    </QueueSightProvider>
  );
};

export default App;
