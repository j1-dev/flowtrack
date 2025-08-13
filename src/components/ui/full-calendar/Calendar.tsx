// Calendar context/provider
'use client';
import React, { useState, useEffect } from 'react';
import { enUS } from 'date-fns/locale/en-US';
import { useHotkeys } from 'react-hotkeys-hook';
import { ContextType, View } from './types';
import { Locale } from 'date-fns';
import { Task } from '@/lib/types';
import { useUserData } from '@/components/data-context';
import { TaskModal } from '@/components/modals/task-modal';

const Context = React.createContext<ContextType>({} as ContextType);

export const useCalendar = () => React.useContext(Context);

export type CalendarProps = {
  children: React.ReactNode;
  defaultDate?: Date;
  events?: Task[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultMode = 'day',
  onChangeView,
}: CalendarProps) => {
  const { tasks } = useUserData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const currentYear = defaultDate.getFullYear();
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<Task[]>([]);

  useEffect(() => {
    setEvents(tasks);
  }, [tasks]);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  const handleSaveTask = async (task: Task) => {
    console.log(task);
    if (!task.title || !task.start || !task.end) return;
    if (task.id) {
      console.log('SAVE');
      // Optimistically update existing event
      let prevEvents: Task[] = [];
      setEvents((prev) => {
        prevEvents = prev;
        return prev.map((e) =>
          e.id === task.id
            ? {
                ...e,
                ...task,
                color: task.color ?? undefined,
                start: new Date(task.start),
                end: new Date(task.end),
              }
            : e
        );
      });

      try {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error('Failed to update');
        const updated = await res.json();
        setEvents((prev) =>
          prev.map((e) =>
            e.id === updated.id
              ? {
                  ...updated,
                  start: new Date(updated.start),
                  end: new Date(updated.end),
                }
              : e
          )
        );
      } catch {
        setEvents(prevEvents);
      }
    } else {
      console.log('CREATE');

      // Optimistically add new event with a temporary id
      const tempId = `temp-${Date.now()}`;
      const optimisticEvent = {
        ...task,
        id: tempId,
        color: task.color ?? undefined,
        start: new Date(task.start),
        end: new Date(task.end),
      };

      let prevEvents: Task[] = [];
      setEvents((prev) => {
        prevEvents = prev;
        return [...prev, optimisticEvent];
      });

      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error('Failed to create');
        const newTask = await res.json();
        setEvents((prev) =>
          prev.map((e) =>
            e.id === tempId
              ? {
                  ...newTask,
                  color: newTask.color ?? undefined,
                  start: new Date(newTask.start),
                  end: new Date(newTask.end),
                }
              : e
          )
        );
      } catch {
        setEvents(prevEvents);
      }
    }
    setEditingTask(null);
    setModalOpen(false);
  };

  const handleDeleteTask = async (task: Task) => {
    setEvents((prev) => prev.filter((e) => e.id !== task.id));
    setEditingTask(null);
    setModalOpen(false);
    console.log('DELETE');
    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
  };

  const handleUpcomingEventClick = (task: Task): void => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleEventClick = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCreateAtTime = (date: Date) => {
    setEditingTask({
      id: '',
      title: '',
      start: date,
      end: new Date(date.getTime() + 60 * 60 * 1000),
      color: '#6366f1',
    } as Task);
    setModalOpen(true);
  };

  const handleEventDrop = (task: Task, newStart: Date) => {
    const duration = task.end.getTime() - task.start.getTime();
    const correctedStart = new Date(newStart);
    correctedStart.setHours(newStart.getHours(), newStart.getMinutes(), 0, 0);
    const newEnd = new Date(correctedStart.getTime() + duration);

    const updatedTask = {
      ...task,
      start: correctedStart,
      end: newEnd,
    };
    handleSaveTask(updatedTask as Task);
  };

  const handleEventResize = (eventId: string, newEnd: Date) => {
    const event = tasks?.find((e) => e.id === eventId);
    if (!event) return;
    const updatedTask = {
      ...event,
      end: newEnd,
    };
    handleSaveTask(updatedTask);
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
        currentYear,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick: handleEventClick,
        onUpcomingEventClick: handleUpcomingEventClick,
        onChangeView,
        today: new Date(),
        onCreateAtTime: handleCreateAtTime,
        onEventDrop: handleEventDrop,
        onEventResize: handleEventResize,
      }}>
      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={editingTask}
      />
      {children}
    </Context.Provider>
  );
};

export { Calendar, Context };
