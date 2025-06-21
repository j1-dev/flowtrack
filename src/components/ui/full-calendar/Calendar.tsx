// Calendar context/provider
'use client';
import React, { useState } from 'react';
import { enUS } from 'date-fns/locale/en-US';
import { useHotkeys } from 'react-hotkeys-hook';
import { ContextType, View, CalendarEvent } from './types';
import { Locale } from 'date-fns';

const Context = React.createContext<ContextType>({} as ContextType);

export const useCalendar = () => React.useContext(Context);

export type CalendarProps = {
  children: React.ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onCreateAtTime?: (date: Date) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultMode = 'month',
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
  onCreateAtTime,
  onEventDrop,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const events = defaultEvents;
  const setEvents = () => {
    throw new Error('setEvents is not supported when using controlled events');
  };

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  useHotkeys('m', () => changeView('month'), { enabled: enableHotkeys });
  useHotkeys('w', () => changeView('week'), { enabled: enableHotkeys });
  useHotkeys('y', () => changeView('year'), { enabled: enableHotkeys });
  useHotkeys('d', () => changeView('day'), { enabled: enableHotkeys });

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today: new Date(),
        onCreateAtTime,
        onEventDrop,
      }}>
      {children}
    </Context.Provider>
  );
};

export { Calendar, Context };
