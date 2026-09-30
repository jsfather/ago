'use client';

import { createContext, useContext, useState } from 'react';
import { Hourglass } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import CalendarPage from './CalendarPage';
import SettingsPage from './SettingsPage';

type Tab = 'home' | 'calendar' | 'settings';
const NavigationContext = createContext<(tab: Tab) => void>(() => {});
export const useAppNavigation = () => useContext(NavigationContext);

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const navigate = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };
  return (
    <NavigationContext.Provider value={navigate}>
      <div className="app-surface">
        <div className="app-container">
          <header className="app-header">
            <button
              className="brand"
              dir="ltr"
              onClick={() => navigate('home')}
              aria-label="Ago — خانه"
            >
              <span className="brand-symbol">
                <Hourglass size={23} strokeWidth={1.7} />
              </span>
              <span className="brand-name">
                ago<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </button>
          </header>
          <main id="main-content">
            {activeTab === 'calendar' ? (
              <CalendarPage />
            ) : activeTab === 'settings' ? (
              <SettingsPage />
            ) : (
              children
            )}
          </main>
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={navigate} />
      </div>
    </NavigationContext.Provider>
  );
}
