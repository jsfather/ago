'use client';

export default function SettingsPage() {
  return (
    <div
      className="min-h-screen px-4 pt-6 pb-20"
      style={{ backgroundColor: '#081827' }}
    >
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="liquid-glass mb-4 px-8 py-4">
            <h1 className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-2xl font-black tracking-wide text-transparent">
              تنظیمات
            </h1>
          </div>
          <div className="liquid-glass-subtle px-6 py-3">
            <p className="text-sm leading-relaxed text-white/70">
              تنظیمات اپلیکیشن
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="liquid-glass overflow-hidden">
          <div className="p-8 text-center">
            <div className="mb-4 text-6xl">⚙️</div>
            <div className="text-lg font-medium text-white/70">به زودی...</div>
            <div className="mt-2 text-sm text-white/50">
              تنظیمات در آپدیت‌های آینده اضافه خواهد شد
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
