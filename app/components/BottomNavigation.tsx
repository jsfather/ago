'use client';

import { Calendar, Settings, Home } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'calendar' | 'settings';
  onTabChange: (tab: 'home' | 'calendar' | 'settings') => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50">
      {/* Enhanced blur bottom navigation */}
      <div className="border-t border-white/5 bg-[#081827]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-around px-4">
          {/* Home Tab */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center justify-center rounded-xl px-4 py-3 transition-all duration-300 ${
              activeTab === 'home'
                ? 'liquid-glass-subtle scale-105 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Home
              className={`h-6 w-6 ${activeTab === 'home' ? 'text-blue-400' : 'text-current'}`}
            />
          </button>

          {/* Calendar Tab */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex items-center justify-center rounded-xl px-4 py-3 transition-all duration-300 ${
              activeTab === 'calendar'
                ? 'liquid-glass-subtle scale-105 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Calendar
              className={`h-6 w-6 ${activeTab === 'calendar' ? 'text-blue-400' : 'text-current'}`}
            />
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center justify-center rounded-xl px-4 py-3 transition-all duration-300 ${
              activeTab === 'settings'
                ? 'liquid-glass-subtle scale-105 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Settings
              className={`h-6 w-6 ${activeTab === 'settings' ? 'text-blue-400' : 'text-current'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
