'use client';

import { useState } from 'react';
import BottomNavigation from './BottomNavigation';
import CalendarPage from './CalendarPage';
import SettingsPage from './SettingsPage';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({
  children,
}: NavigationWrapperProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'settings'>(
    'home'
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return children;
    }
  };

  return (
    <>
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
