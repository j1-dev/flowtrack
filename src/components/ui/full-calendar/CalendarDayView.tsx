import React, { useEffect, useRef, useState } from 'react';
import { setHours } from 'date-fns';
import { useCalendar } from './Calendar';
import EventGroup from './EventGroup';
import TimeTable from './TimeTable';
import HabitIndicator from './HabitIndicator';
import { useUserData } from '@/components/data-context';

const CalendarDayView = () => {
  const { view, events, date, onCreateAtTime, onEventDrop } = useCalendar();
  const { habits } = useUserData();
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [dragOverY, setDragOverY] = useState<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTimeRef.current) {
      currentTimeRef.current.scrollIntoView({
        block: 'center',
        inline: 'start',
      });
    }
  }, [view]);

  if (view !== 'day') return null;
  const hours = [...Array(24)].map((_, i) => setHours(date, i));
  const now = new Date();

  const handleMouseLeave = () => {
    setCursorY(null);
  };

  return (
    <div className="flex relative pt-2">
      <div className="flex-1 flex max-h-[80vh] overflow-auto">
        <div className="w-14 shrink-0">
          <TimeTable />
        </div>
        <div
          className="flex-1 relative cursor-pointer h-max"
          ref={calendarRef}
          onMouseMove={(e) => {
            const ref = calendarRef.current;
            if (!ref) return;
            const rect = ref.getBoundingClientRect();
            const scrollTop = ref.scrollTop;
            let y = e.clientY - rect.top + scrollTop;
            const percent = Math.max(0, Math.min(1, y / ref.scrollHeight));
            const minutes = Math.round(percent * 24 * 60);
            const snappedMinutes = Math.round(minutes / 15) * 15;
            const snappedPercent = snappedMinutes / (24 * 60);
            y = snappedPercent * ref.scrollHeight;
            setCursorY(y);
          }}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            const ref = calendarRef.current;
            if (!ref) return;
            const rect = ref.getBoundingClientRect();
            const scrollTop = ref.scrollTop;
            const y = e.clientY - rect.top + scrollTop;
            const percent = Math.max(0, Math.min(1, y / ref.scrollHeight));
            let minutes = Math.round(percent * 24 * 60);
            minutes = Math.round(minutes / 15) * 15;
            const clicked = new Date(date);
            clicked.setHours(0, 0, 0, 0);
            clicked.setMinutes(minutes);
            onCreateAtTime?.(clicked);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            const ref = calendarRef.current;
            if (!ref) return;
            const rect = ref.getBoundingClientRect();
            const scrollTop = ref.scrollTop;
            let y = e.clientY - rect.top + scrollTop;
            const percent = Math.max(0, Math.min(1, y / ref.scrollHeight));
            const minutes = Math.round(percent * 24 * 60);
            const snappedMinutes = Math.round(minutes / 15) * 15;
            const snappedPercent = snappedMinutes / (24 * 60);
            y = snappedPercent * ref.scrollHeight;
            setDragOverY(y);
          }}
          onDragLeave={() => setDragOverY(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverY(null);
            const eventId = e.dataTransfer.getData('event-id');
            const ref = calendarRef.current;
            if (!eventId || !ref) return;
            const rect = ref.getBoundingClientRect();
            const scrollTop = ref.scrollTop;
            const y = e.clientY - rect.top + scrollTop;
            const percent = Math.max(0, Math.min(1, y / ref.scrollHeight));
            let minutes = Math.round(percent * 24 * 60);
            minutes = Math.round(minutes / 15) * 15;
            const newStart = new Date(date);
            newStart.setHours(0, 0, 0, 0);
            newStart.setMinutes(minutes);
            const event = events.find((ev) => ev.id === eventId);
            if (event && onEventDrop) {
              onEventDrop(event, newStart);
            }
          }}>
          {/* Current time indicator */}
          {(() => {
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
                  <div className="size-2 rounded-full bg-red-500 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                  <div className="w-full h-0.5 bg-red-500"></div>
                </div>
              </div>
            );
          })()}
          {cursorY !== null && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: cursorY,
                borderBottom: '2px dashed rgba(59,130,246,0.7)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            />
          )}
          {dragOverY !== null && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: dragOverY,
                height: 4,
                background: 'rgba(16,185,129,0.7)',
                zIndex: 30,
                pointerEvents: 'none',
              }}
            />
          )}
          {hours.map((hour) => (
            <div key={hour.toString()} className="relative">
              <EventGroup
                hour={hour}
                events={events}
                calendarRef={calendarRef}
              />
              <HabitIndicator habits={habits} hour={hour} maxOccurrences={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;
