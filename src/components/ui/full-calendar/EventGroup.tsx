import React from 'react';
import { isSameHour, differenceInMinutes } from 'date-fns';
import { useCalendar } from './Calendar';
import { Task } from '@/lib/types';

type EventGroupProps = {
  events: Task[];
  hour: Date;
  calendarRef?: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null;
};

const EventGroup = ({ events, hour, calendarRef }: EventGroupProps) => {
  const { onEventClick, onEventResize } = useCalendar();

  return (
    <div className="h-20 border-t last:border-b">
      {events
        .filter((event) => isSameHour(event.start, hour))
        .map((event) => {
          const hoursDifference =
            differenceInMinutes(event.end, event.start) / 60;
          const startPosition = event.start.getMinutes() / 60;

          return (
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('event-id', event.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onEventClick) onEventClick(event);
              }}
              key={event.id}
              className="relative font-bold border-l-4 rounded p-2 text-xs cursor-move group"
              style={{
                top: `${startPosition * 100}%`,
                height: `${hoursDifference * 100}%`,
                backgroundColor: `${event.color}4D`,
                color: `${event.color}`,
                borderLeftColor: `${event.color}`,
                userSelect: 'none',
              }}>
              {event.title}
              {/* Resize handle */}
              <div
                className="absolute left-0 right-0 bottom-0 h-1 cursor-ns-resize group-hover:bg-black/20"
                style={{ zIndex: 10 }}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.setData('resize-event-id', event.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={(e) => {
                  e.preventDefault();
                  if (!onEventResize) return;
                  let refEl: HTMLDivElement | null = null;
                  if (calendarRef) {
                    if ('current' in calendarRef) {
                      refEl = calendarRef.current;
                    } else {
                      refEl = calendarRef;
                    }
                  }
                  if (!refEl) return;
                  const rect = refEl.getBoundingClientRect();
                  // For week view, scrollTop may not be needed, but for day view it is
                  const scrollTop = refEl.scrollTop ?? 0;
                  const y = e.clientY - rect.top + scrollTop;
                  const percent = Math.max(
                    0,
                    Math.min(1, y / (refEl.scrollHeight || rect.height))
                  );
                  let minutes = Math.round(percent * 24 * 60);
                  minutes = Math.round(minutes / 15) * 15;
                  const newEnd = new Date(event.start);
                  newEnd.setHours(0, 0, 0, 0);
                  newEnd.setMinutes(minutes);
                  // Only allow resizing forward in time
                  if (newEnd > event.start) {
                    onEventResize(event.id, newEnd);
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  // TODO: Implement touch resize logic if needed
                }}
              />
            </div>
          );
        })}
    </div>
  );
};

export default EventGroup;
