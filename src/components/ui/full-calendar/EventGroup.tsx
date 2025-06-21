import React from 'react';
import { isSameHour, differenceInMinutes } from 'date-fns';
import { useCalendar } from './Calendar';
import { CalendarEvent } from './types';

const EventGroup = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  const { onEventClick } = useCalendar();
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
              className="relative font-bold border-l-4 rounded p-2 text-xs cursor-move"
              style={{
                top: `${startPosition * 100}%`,
                height: `${hoursDifference * 100}%`,
                backgroundColor: `${event.color}4D`,
                color: `${event.color}`,
                borderLeftColor: `${event.color}`,
              }}>
              {event.title}
            </div>
          );
        })}
    </div>
  );
};

export default EventGroup;
