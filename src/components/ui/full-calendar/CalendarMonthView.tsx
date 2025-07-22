import React, { useMemo, useState } from 'react';
import { isSameDay, isSameMonth, isToday, format } from 'date-fns';
import { useCalendar } from './Calendar';
import { getDaysInMonth, generateWeekdays } from './utils';
import { cn } from '@/lib/utils';

const CalendarMonthView = () => {
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  const {
    date,
    view,
    events,
    locale,
    onEventDrop,
    onCreateAtTime,
    onEventClick,
    setView,
    setDate,
  } = useCalendar();
  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'month') return null;

  if (!Array.isArray(events)) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 gap-px sticky top-0 bg-background border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              'mb-2 text-right text-sm text-muted-foreground pr-2',
              [0, 6].includes(i) && 'text-muted-foreground/50'
            )}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) =>
            isSameDay(event.start, _date)
          );
          return (
            <div
              className={cn(
                'cursor-pointer ring-1 p-2 text-sm text-muted-foreground ring-border overflow-auto group relative',
                !isSameMonth(date, _date) && 'text-muted-foreground/50',
                dragOverDate &&
                  isSameDay(dragOverDate, _date) &&
                  'ring-2 ring-green-500 z-10'
              )}
              key={_date.toString()}
              onClick={() => {
                if (onCreateAtTime) {
                  const noon = new Date(
                    _date.getFullYear(),
                    _date.getMonth(),
                    _date.getDate(),
                    12, // 12 PM
                    0,
                    0,
                    0
                  );
                  onCreateAtTime(noon);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverDate(_date);
              }}
              onDragLeave={() => {
                setDragOverDate(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDate(null);
                const eventId = e.dataTransfer.getData('event-id');
                if (!eventId) return;
                const event = events.find((ev) => ev.id === eventId);
                if (!event || !onEventDrop) return;
                const newStart = new Date(_date);
                newStart.setHours(
                  event.start.getHours(),
                  event.start.getMinutes(),
                  0,
                  0
                );
                onEventDrop(event, newStart);
              }}>
              <span
                className={cn(
                  'size-6 grid place-items-center rounded-full mb-1 sticky top-0 z-40',
                  isToday(_date)
                    ? 'bg-primary text-primary-foreground'
                    : 'group-hover:bg-muted'
                )}
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  e.stopPropagation();
                  console.log(setView, setDate)
                  setView('day');
                  setDate(_date);
                }}>
                {format(_date, 'd')}
              </span>
              {currentEvents.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="px-1 rounded text-sm flex items-center gap-1 cursor-move hover:bg-muted/40 z-50"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('event-id', event.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}>
                    <div
                      className={cn('shrink-0')}
                      style={
                        event.color && event.color.startsWith('#')
                          ? {
                              background: event.color,
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                            }
                          : undefined
                      }></div>
                    <span className="flex-1 truncate">{event.title}</span>
                    <time className="tabular-nums text-muted-foreground/50 text-xs">
                      {format(event.start, 'HH:mm')}
                    </time>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonthView;
