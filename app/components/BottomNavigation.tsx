'use client';
import { CalendarDays, SlidersHorizontal, House } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'خانه', name: 'Home', icon: House },
  { id: 'calendar', label: 'تاریخ‌ها', name: 'Calendar', icon: CalendarDays },
  {
    id: 'settings',
    label: 'تنظیمات',
    name: 'Settings',
    icon: SlidersHorizontal,
  },
] as const;

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: 'home' | 'calendar' | 'settings';
  onTabChange: (tab: 'home' | 'calendar' | 'settings') => void;
}) {
  return (
    <nav className="bottom-navigation" aria-label="ناوبری اصلی">
      <div className="flex items-center gap-1">
        {tabs.map(({ id, label, name, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-label={`${name} — ${label}`}
            aria-current={activeTab === id ? 'page' : undefined}
            className="nav-button"
          >
            <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
