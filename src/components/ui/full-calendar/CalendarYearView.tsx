import React, { useMemo } from 'react';
import { setMonth, getMonth, isSameDay, format } from 'date-fns';
import { useCalendar } from './Calendar';
import { getDaysInMonth, generateWeekdays } from './utils';
import { cn } from '@/lib/utils';

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) return [];
    return Array.from({ length: 12 }).map((_, i) =>
      getDaysInMonth(setMonth(date, i))
    );
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'year') return null;

  return (
    <div className="grid grid-cols-4 gap-10 overflow-auto h-full">
      {months.map((days, i) => (
        <div key={days[0].toString()}>
          <span className="text-xl">{i + 1}</span>
          <div className="grid grid-cols-7 gap-2 my-5">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
            {days.map((_date) => (
              <div
                key={_date.toString()}
                className={cn(
                  getMonth(_date) !== i && 'text-muted-foreground'
                )}>
                <div
                  className={cn(
                    'aspect-square grid place-content-center size-full tabular-nums',
                    isSameDay(today, _date) &&
                      getMonth(_date) === i &&
                      'bg-primary text-primary-foreground rounded-full'
                  )}>
                  {format(_date, 'd')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default CalendarYearView;
