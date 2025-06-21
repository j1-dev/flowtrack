import React, { useRef, useState } from 'react';
import { setHours } from 'date-fns';
import { useCalendar } from './Calendar';
import EventGroup from './EventGroup';
import TimeTable from './TimeTable';

const CalendarDayView = () => {
  const { view, events, date, onCreateAtTime, onEventDrop } = useCalendar();
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [dragOverY, setDragOverY] = useState<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  if (view !== 'day') return null;

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  // handleMouseMove removed; logic is now inline with null checks

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
          className="flex-1 relative cursor-pointer"
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
          {cursorY !== null && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: cursorY,
                height: 2,
                background: 'rgba(59,130,246,0.7)',
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
            <EventGroup key={hour.toString()} hour={hour} events={events} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;
