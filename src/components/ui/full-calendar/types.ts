// Calendar types
import { Locale } from 'date-fns';

export type View = 'day' | 'week' | 'month' | 'year';

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string;
};

export type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
  onCreateAtTime?: (date: Date) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date) => void;
};
