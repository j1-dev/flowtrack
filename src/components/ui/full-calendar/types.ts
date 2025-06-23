// Calendar types
import { Task } from '@/lib/types';
import { Locale } from 'date-fns';

export type View = 'day' | 'week' | 'month' | 'year';

export type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: Task[];
  locale: Locale;
  setEvents: (date: Task[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: Task) => void;
  enableHotkeys?: boolean;
  today: Date;
  onCreateAtTime?: (date: Date) => void;
  onEventDrop?: (event: Task, newStart: Date) => void;
  onEventResize?: (eventId: string, newEnd: Date) => void;
};
