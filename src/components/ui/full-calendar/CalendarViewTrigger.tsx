import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCalendar } from './Calendar';
import { View } from './types';

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & { view: View }
>(({ children, view, ...props }, ref) => {
  const { view: currentView, setView, onChangeView } = useCalendar();
  return (
    <Button
      ref={ref}
      aria-current={currentView === view}
      size="sm"
      variant="ghost"
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}>
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';
export default CalendarViewTrigger;
