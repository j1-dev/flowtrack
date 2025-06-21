import React, { forwardRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCalendar } from './Calendar';

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const prev = useCallback(() => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subWeeks(date, 1));
    } else if (view === 'month') {
      setDate(subMonths(date, 1));
    } else if (view === 'year') {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys('ArrowLeft', () => prev(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}>
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';
export default CalendarPrevTrigger;
