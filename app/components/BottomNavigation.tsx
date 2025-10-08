'use client';

import { Calendar, Settings, Home } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'calendar' | 'settings';
  onTabChange: (tab: 'home' | 'calendar' | 'settings') => void;
}

interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
}

function NavButton({ isActive, onClick, icon, ariaLabel }: NavButtonProps) {
  const handleClick = () => {
    onClick();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus on mousedown
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      aria-label={ariaLabel}
      className={`nav-button flex cursor-pointer items-center justify-center rounded-xl px-4 py-3 transition-all duration-300 ${isActive ? 'liquid-glass-subtle scale-105' : ''} `}
      style={{
        color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
      }}
      tabIndex={-1} // Remove from tab order
    >
      {icon}
    </button>
  );
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50">
      {/* Enhanced blur bottom navigation */}
      <div
        className="border-t backdrop-blur-xl"
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--nav-border)',
        }}
      >
        <div className="flex h-16 items-center justify-around px-4">
          <NavButton
            isActive={activeTab === 'home'}
            onClick={() => onTabChange('home')}
            icon={
              <Home
                className={`h-6 w-6 ${activeTab === 'home' ? 'text-blue-400' : 'text-current'}`}
              />
            }
            ariaLabel="Home"
          />

          <NavButton
            isActive={activeTab === 'calendar'}
            onClick={() => onTabChange('calendar')}
            icon={
              <Calendar
                className={`h-6 w-6 ${activeTab === 'calendar' ? 'text-blue-400' : 'text-current'}`}
              />
            }
            ariaLabel="Calendar"
          />

          <NavButton
            isActive={activeTab === 'settings'}
            onClick={() => onTabChange('settings')}
            icon={
              <Settings
                className={`h-6 w-6 ${activeTab === 'settings' ? 'text-blue-400' : 'text-current'}`}
              />
            }
            ariaLabel="Settings"
          />
        </div>
      </div>
    </div>
  );
}
