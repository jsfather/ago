'use client';

import { Calendar, Settings, Home } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'calendar' | 'settings';
  onTabChange: (tab: 'home' | 'calendar' | 'settings') => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav
      className="bottom-navigation liquid-glass-strong"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-label={label}
            aria-current={activeTab === id ? 'page' : undefined}
            className="nav-button"
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  );
}
