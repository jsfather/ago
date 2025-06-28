import { getAgoFromShamsiDate } from '@/app/lib/utils';

export default function Home() {
  const ago = getAgoFromShamsiDate(1403, 12, 1);

  const timeUnits = [
    { value: ago.years, label: 'سال', show: ago.years > 0 },
    { value: ago.months, label: 'ماه', show: ago.months > 0 },
    { value: ago.days, label: 'روز', show: ago.days > 0 },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-8">
      <div className="space-y-8 text-center">
        {timeUnits.map(
          (unit, index) =>
            unit.show && (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 font-mono text-8xl font-bold tracking-wider text-white">
                  {unit.value}
                </div>
                <div className="text-3xl font-medium text-gray-300">
                  {unit.label}
                </div>
              </div>
            )
        )}

        {timeUnits.every((unit) => !unit.show) && (
          <div className="text-4xl text-gray-400">هنوز زمانی نگذشته</div>
        )}
      </div>
    </div>
  );
}
