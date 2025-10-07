'use client';

import { useState } from 'react';
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
      {/* Liquid glass bottom navigation */}
      <div className="liquid-glass border-t border-white/10">
        <div className="flex h-16 items-center justify-around px-4">
          {/* Home Tab */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center space-y-1 rounded-xl px-4 py-2 transition-all duration-300 ${
              activeTab === 'home'
                ? 'liquid-glass-subtle scale-105 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Home
              className={`h-6 w-6 ${activeTab === 'home' ? 'text-blue-400' : 'text-current'}`}
            />
            <span className="text-xs font-medium">خانه</span>
          </button>

          {/* Calendar Tab */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center justify-center space-y-1 rounded-xl px-4 py-2 transition-all duration-300 ${
              activeTab === 'calendar'
                ? 'liquid-glass-subtle scale-105 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Calendar
              className={`h-6 w-6 ${activeTab === 'calendar' ? 'text-blue-400' : 'text-current'}`}
            />
            <span className="text-xs font-medium">تقویم</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center space-y-1 rounded-xl px-4 py-2 transition-all duration-300 ${
              activeTab === 'settings'
                ? 'liquid-glass-subtle scale-105 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Settings
              className={`h-6 w-6 ${activeTab === 'settings' ? 'text-blue-400' : 'text-current'}`}
            />
            <span className="text-xs font-medium">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
