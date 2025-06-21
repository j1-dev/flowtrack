import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from './Calendar';

const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();
  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {format(date, view === 'day' ? 'dd MMMM yyyy' : 'MMMM yyyy')}
    </time>
  );
};

export default CalendarCurrentDate;
