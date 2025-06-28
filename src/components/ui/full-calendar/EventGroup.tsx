import React from 'react';
// import { isSameHour, differenceInMinutes } from 'date-fns';
import { useCalendar } from './Calendar';
import { Task } from '@/lib/types';

type EventGroupProps = {
  events: Task[];
  hour: Date;
  calendarRef?: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null;
  weekColumnRefs?: (HTMLDivElement | null)[];
  weekColumnDates?: Date[];
};

const EventGroup = ({
  events,
  hour,
  calendarRef,
  weekColumnRefs,
  weekColumnDates,
}: EventGroupProps) => {
  const { onEventClick, onEventResize } = useCalendar();

  return (
    <div className="h-20 border-t last:border-b">
      {events
        .filter((event) => {
          const eventStart = event.start;
          const eventEnd = event.end;
          const hourStart = new Date(hour);
          hourStart.setMinutes(0, 0, 0);
          // If event starts in this hour, render it here
          if (
            eventStart.getFullYear() === hourStart.getFullYear() &&
            eventStart.getMonth() === hourStart.getMonth() &&
            eventStart.getDate() === hourStart.getDate() &&
            eventStart.getHours() === hourStart.getHours()
          ) {
            return true;
          }

          // If event started before today, render it at the first hour of the day
          const isFirstHourOfDay = hourStart.getHours() === 0;
          const eventStartedBeforeToday =
            eventStart < hourStart &&
            eventEnd > hourStart &&
            (eventStart.getFullYear() !== hourStart.getFullYear() ||
              eventStart.getMonth() !== hourStart.getMonth() ||
              eventStart.getDate() !== hourStart.getDate());
          return isFirstHourOfDay && eventStartedBeforeToday;
        })
        .map((event) => {
          // For events that start before today, start at 0:00; otherwise, start at event.start
          const hourStart = new Date(hour);
          hourStart.setMinutes(0, 0, 0);
          const dayStart = new Date(hourStart);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(24, 0, 0, 0);

          const visibleStart = event.start > dayStart ? event.start : dayStart;
          const visibleEnd = event.end < dayEnd ? event.end : dayEnd;

          const minutesFromDayStart =
            (visibleStart.getTime() - dayStart.getTime()) / 1000 / 60;
          const minutesDuration =
            (visibleEnd.getTime() - visibleStart.getTime()) / 1000 / 60;

          // If the event is less than 1 minute, don't render
          if (minutesDuration < 1) return null;

          const startPosition = minutesFromDayStart / (24 * 60);
          const height = minutesDuration / (24 * 60);

          // Only show resize handle if this is the true end of the event (not clipped by day)
          const showResizeHandle = visibleEnd.getTime() === event.end.getTime();

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
              key={event.id + '-' + dayStart.toISOString()}
              className="absolute font-bold border-l-4 rounded p-2 text-xs cursor-move group w-full"
              style={{
                top: `${startPosition * 100}%`,
                height: `${height * 100}%`,
                backgroundColor: `${event.color}4D`,
                color: `${event.color}`,
                borderLeftColor: `${event.color}`,
                userSelect: 'none',
              }}>
              {event.title}
              {/* Resize handle only if this is the true end of the event */}
              {showResizeHandle && (
                <div
                  className="z-10 absolute left-0 right-0 bottom-0 h-1 cursor-ns-resize group-hover:bg-black/20"
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData('resize-event-id', event.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    if (!onEventResize) return;

                    // If weekColumnRefs and weekColumnDates are provided, use them to determine the day
                    if (
                      weekColumnRefs &&
                      weekColumnDates &&
                      weekColumnRefs.length === weekColumnDates.length
                    ) {
                      // Find which column the mouse is over
                      let foundIdx = -1;
                      for (let i = 0; i < weekColumnRefs.length; i++) {
                        const col = weekColumnRefs[i];
                        if (!col) continue;
                        const rect = col.getBoundingClientRect();
                        if (
                          e.clientX >= rect.left &&
                          e.clientX <= rect.right &&
                          e.clientY >= rect.top &&
                          e.clientY <= rect.bottom
                        ) {
                          foundIdx = i;
                          break;
                        }
                      }
                      if (foundIdx === -1) return;
                      const col = weekColumnRefs[foundIdx];
                      const colDate = weekColumnDates[foundIdx];
                      if (!col || !colDate) return;
                      const rect = col.getBoundingClientRect();
                      const y = e.clientY - rect.top;
                      const percent = Math.max(0, Math.min(1, y / rect.height));
                      let minutes = Math.round(percent * 24 * 60);
                      minutes = Math.round(minutes / 15) * 15;
                      const newEnd = new Date(
                        colDate.getFullYear(),
                        colDate.getMonth(),
                        colDate.getDate(),
                        0,
                        0,
                        0,
                        0
                      );
                      newEnd.setMinutes(minutes);
                      // Only allow resizing forward in time
                      if (newEnd > event.start) {
                        onEventResize(event.id, newEnd);
                      }
                      return;
                    }

                    // Fallback: original logic (single day/column)
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
                    if (newEnd > event.start) {
                      onEventResize(event.id, newEnd);
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    // TODO: Implement touch resize logic if needed
                  }}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default EventGroup;
