import React, { useEffect, useState } from 'react';
import { isSameHour, differenceInMinutes } from 'date-fns';
import { useCalendar } from './Calendar';
import { Task } from '@/lib/types';

const EventGroup = ({ events, hour }: { events: Task[]; hour: Date }) => {
  const { onEventClick, onEventResize } = useCalendar();
  const [newEnd, setNewEnd] = useState<Date>(new Date());

  useEffect(()=>{

  },[])
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
                className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize group-hover:bg-black/20"
                style={{ zIndex: 10 }}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  // For visual feedback, store the initial Y and event id in dataTransfer
                  e.dataTransfer.setData('resize-event-id', event.id);
                  e.dataTransfer.setData('resize-start-y', String(e.clientY));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDrag={(e) => {
                  e.preventDefault()
                  if (!onEventResize || e.clientY === 0) return;
                  const startY = Number(
                    e.dataTransfer.getData('resize-start-y')
                  );
                  const deltaY = e.clientY - startY;
                  const minutesPerPx = 60 / 100;
                  const deltaMinutes =
                    Math.round((deltaY * minutesPerPx) / 15) * 15;
                  let newEnd = new Date(event.end.getTime());
                  newEnd.setMinutes(newEnd.getMinutes() + deltaMinutes);
                  if (newEnd <= event.start) {
                    newEnd = new Date(event.start.getTime() + 15 * 60 * 1000);
                  }
                  console.log(newEnd)
                  setNewEnd(newEnd)
                }}
                onDragEnd={(e) => {
                  e.stopPropagation()
                  onEventResize?.(event.id, newEnd);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  const touch = e.touches[0];
                  const startY = touch.clientY;
                  const move = (moveEvent: TouchEvent) => {
                    if (!onEventResize) return;
                    const currentY = moveEvent.touches[0].clientY;
                    const deltaY = currentY - startY;
                    const minutesPerPx = 60 / 100;
                    const deltaMinutes =
                      Math.round((deltaY * minutesPerPx) / 15) * 15;
                    let newEnd = new Date(event.end.getTime());
                    newEnd.setMinutes(newEnd.getMinutes() + deltaMinutes);
                    if (newEnd <= event.start) {
                      newEnd = new Date(event.start.getTime() + 15 * 60 * 1000);
                    }
                    onEventResize(event.id, newEnd);
                  };
                  const up = () => {
                    window.removeEventListener('touchmove', move);
                    window.removeEventListener('touchend', up);
                  };
                  window.addEventListener('touchmove', move);
                  window.addEventListener('touchend', up);
                }}
              />
            </div>
          );
        })}
    </div>
  );
};

export default EventGroup;
