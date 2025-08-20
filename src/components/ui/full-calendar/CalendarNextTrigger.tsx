import React, { forwardRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { addDays, addMonths, addYears } from 'date-fns';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCalendar } from './Calendar';

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      // Move week view one day forwards
      setDate(addDays(date, 1));
    } else if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'year') {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys('ArrowRight', () => next(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}>
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';
export default CalendarNextTrigger;
