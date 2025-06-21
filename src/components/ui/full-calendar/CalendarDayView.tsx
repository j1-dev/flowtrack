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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!calendarRef.current) return;
    const rect = calendarRef.current.getBoundingClientRect();
    let y = e.clientY - rect.top;
    const percent = Math.max(0, Math.min(1, y / rect.height));
    const minutes = Math.round(percent * 24 * 60);
    const snappedMinutes = Math.round(minutes / 15) * 15;
    const snappedPercent = snappedMinutes / (24 * 60);
    y = snappedPercent * rect.height;
    setCursorY(y);
  };

  const handleMouseLeave = () => {
    setCursorY(null);
  };

  return (
    <div className="flex relative pt-2 overflow-auto">
      <TimeTable />
      <div
        className="flex-1 relative h-full"
        ref={calendarRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          if (!calendarRef.current) return;
          const rect = calendarRef.current.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const percent = Math.max(0, Math.min(1, y / rect.height));
          let minutes = Math.round(percent * 24 * 60);
          minutes = Math.round(minutes / 15) * 15;
          const clicked = new Date(date);
          clicked.setHours(0, 0, 0, 0);
          clicked.setMinutes(minutes);
          onCreateAtTime?.(clicked);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!calendarRef.current) return;
          const rect = calendarRef.current.getBoundingClientRect();
          let y = e.clientY - rect.top;
          const percent = Math.max(0, Math.min(1, y / rect.height));
          const minutes = Math.round(percent * 24 * 60);
          const snappedMinutes = Math.round(minutes / 15) * 15;
          const snappedPercent = snappedMinutes / (24 * 60);
          y = snappedPercent * rect.height;
          setDragOverY(y);
        }}
        onDragLeave={() => setDragOverY(null)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverY(null);
          const eventId = e.dataTransfer.getData('event-id');
          if (!eventId) return;
          const rect = calendarRef.current?.getBoundingClientRect();
          if (!rect) return;
          const y = e.clientY - rect.top;
          const percent = Math.max(0, Math.min(1, y / rect.height));
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
  );
};

export default CalendarDayView;
