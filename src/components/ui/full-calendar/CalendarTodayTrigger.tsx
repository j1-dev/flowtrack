import React, { forwardRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCalendar } from './Calendar';

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  useHotkeys('t', () => jumpToToday(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}>
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';
export default CalendarTodayTrigger;
