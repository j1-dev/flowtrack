import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addDays, setHours, startOfWeek, format, isToday } from 'date-fns';
import { useCalendar } from './Calendar';
import EventGroup from './EventGroup';
import TimeTable from './TimeTable';
import { cn } from '@/lib/utils';

const CalendarWeekView = () => {
  const { view, date, locale, events, onCreateAtTime, onEventDrop } =
    useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }
    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  const [cursorY, setCursorY] = useState<(number | null)[]>(() =>
    Array(7).fill(null)
  );
  const [dragOverY, setDragOverY] = useState<(number | null)[]>(() =>
    Array(7).fill(null)
  );
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTimeRef.current) {
      currentTimeRef.current.scrollIntoView({
        block: 'center',
        inline: 'start',
      });
    }
  }, [view]);

  if (view !== 'week') return null;

  return (
    <div className="flex flex-col relative overflow-auto h-full">
      <div className="flex sticky top-0 bg-card z-10 border-b mb-3">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              'text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center',
              [0, 6].includes(i) && 'text-muted-foreground/50'
            )}>
            {format(date, 'E', { locale })}
            <span
              className={cn(
                'h-6 grid place-content-center',
                isToday(date) &&
                  'bg-primary text-primary-foreground rounded-full size-6'
              )}>
              {format(date, 'd')}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>

        <div className="grid grid-cols-7 flex-1">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  'h-full text-sm text-muted-foreground border-l first:border-l-0 relative cursor-pointer',
                  [0, 6].includes(i) && 'bg-muted/50'
                )}
                key={hours[0].toString()}
                ref={(el) => {
                  columnRefs.current[i] = el;
                }}
                onMouseMove={(e) => {
                  const rect = columnRefs.current[i]?.getBoundingClientRect();
                  if (!rect) return;
                  let y = e.clientY - rect.top;
                  const percent = Math.max(0, Math.min(1, y / rect.height));
                  const minutes = Math.round(percent * 24 * 60);
                  const snappedMinutes = Math.round(minutes / 15) * 15;
                  const snappedPercent = snappedMinutes / (24 * 60);
                  y = snappedPercent * rect.height;
                  setCursorY((prev) => {
                    const next = [...prev];
                    next[i] = y;
                    return next;
                  });
                }}
                onMouseLeave={() => {
                  setCursorY((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  });
                  setDragOverY((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  });
                }}
                onClick={(e) => {
                  const rect = columnRefs.current[i]?.getBoundingClientRect();
                  if (!rect) return;
                  const y = e.clientY - rect.top;
                  const percent = Math.max(0, Math.min(1, y / rect.height));
                  let minutes = Math.round(percent * 24 * 60);
                  minutes = Math.round(minutes / 15) * 15;
                  const clicked = new Date(
                    headerDays[i].getFullYear(),
                    headerDays[i].getMonth(),
                    headerDays[i].getDate(),
                    0,
                    0,
                    0,
                    0
                  );
                  clicked.setMinutes(minutes);
                  onCreateAtTime?.(clicked);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  const rect = columnRefs.current[i]?.getBoundingClientRect();
                  if (!rect) return;
                  let y = e.clientY - rect.top;
                  const percent = Math.max(0, Math.min(1, y / rect.height));
                  const minutes = Math.round(percent * 24 * 60);
                  const snappedMinutes = Math.round(minutes / 15) * 15;
                  const snappedPercent = snappedMinutes / (24 * 60);
                  y = snappedPercent * rect.height;
                  setDragOverY((prev) => {
                    const next = [...prev];
                    next[i] = y;
                    return next;
                  });
                }}
                onDragLeave={() => {
                  setDragOverY((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverY((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  });
                  const eventId = e.dataTransfer.getData('event-id');
                  if (!eventId) return;
                  const rect = columnRefs.current[i]?.getBoundingClientRect();
                  if (!rect) return;
                  const y = e.clientY - rect.top;
                  const percent = Math.max(0, Math.min(1, y / rect.height));
                  let minutes = Math.round(percent * 24 * 60);
                  minutes = Math.round(minutes / 15) * 15;
                  const newStart = new Date(
                    headerDays[i].getFullYear(),
                    headerDays[i].getMonth(),
                    headerDays[i].getDate(),
                    0,
                    0,
                    0,
                    0
                  );
                  newStart.setMinutes(minutes);
                  const event = events.find((ev) => ev.id === eventId);
                  if (event && onEventDrop) {
                    onEventDrop(event, newStart);
                  }
                }}>
                {/* Current time indicator */}
                {(() => {
                  const now = new Date();
                  const currentHour = now.getHours();
                  const currentMinute = now.getMinutes();
                  const totalMinutes = currentHour * 60 + currentMinute;
                  const position = (totalMinutes / (24 * 60)) * 100;

                  return (
                    <div
                      ref={currentTimeRef}
                      className="absolute left-0 right-0 z-40 pointer-events-none"
                      style={{
                        top: `${position}%`,
                      }}>
                      <div className="flex items-center">
                        {i === 0 && (
                          <div className="size-2 rounded-full bg-red-500 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                        )}
                        <div className="w-full h-0.5 bg-red-500"></div>
                      </div>
                    </div>
                  );
                })()}
                {cursorY[i] !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: cursorY[i]!,
                      borderBottom: '2px dashed rgba(59,130,246,0.7)',
                      zIndex: 20,
                      pointerEvents: 'none',
                    }}
                  />
                )}
                {dragOverY[i] !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: dragOverY[i]!,
                      height: 4,
                      background: 'rgba(16,185,129,0.7)',
                      zIndex: 30,
                      pointerEvents: 'none',
                    }}
                  />
                )}
                {hours.map((hour) => (
                  <EventGroup
                    key={hour.toString()}
                    hour={hour}
                    events={events}
                    calendarRef={columnRefs.current[i]}
                    weekColumnRefs={columnRefs.current}
                    weekColumnDates={headerDays}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;
