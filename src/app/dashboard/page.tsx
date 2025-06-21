'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthButtons } from '@/components/auth-buttons';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Navbar } from '@/components/navbar';
import { TaskModal } from '@/components/task-modal';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
  type CalendarEvent,
} from '@/components/ui/full-calendar/index';
import { Task } from '@/lib/types';

const DashboardPage: FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=/dashboard`);
    }
  }, [status, router]);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map((task: Task) => ({
            id: task.id,
            start: new Date(task.startTime),
            end: new Date(task.endTime),
            title: task.title,
            color: task.color,
          }))
        );
      });
  }, []);

  // Optionally keep for debugging
  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleSaveTask = async (task: Task) => {
    if (!task.title || !task.startTime || !task.endTime) return;
    if (task.id) {
      // Edit existing
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const updated = await res.json();
      setEvents((prev) =>
        prev.map((e) =>
          e.id === updated.id
            ? {
                ...updated,
                start: new Date(updated.startTime),
                end: new Date(updated.endTime),
              }
            : e
        )
      );
    } else {
      // Create new
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      setEvents((prev) => [
        ...prev,
        {
          ...newTask,
          start: new Date(newTask.startTime),
          end: new Date(newTask.endTime),
        },
      ]);
    }
    setEditingTask(null);
    setModalOpen(false);
  };

  const handleEventDrop = (event: CalendarEvent, newStart: Date) => {
    const duration = event.end.getTime() - event.start.getTime();
    // Ensure newStart uses the original event's date, only updating the time
    const correctedStart = new Date(newStart);
    correctedStart.setHours(newStart.getHours(), newStart.getMinutes(), 0, 0);
    const newEnd = new Date(correctedStart.getTime() + duration);
    // Update event in state and persist to backend
    const updatedTask = {
      id: event.id,
      title: event.title,
      color: event.color,
      startTime: correctedStart,
      endTime: newEnd,
    };
    handleSaveTask(updatedTask as Task); // handleSaveTask expects Task shape
  };

  // const handleDelete = async (id: string) => {
  //   await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  //   setEvents((prev) => prev.filter((e) => e.id !== id));
  // };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Navbar
        onCreateTask={() => {
          setEditingTask(null);
          setModalOpen(true);
        }}
      />
      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
      <main className="flex-1 p-8 overflow-auto  transition-all duration-200">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold md:ml-0 ml-4">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <AuthButtons />
          </div>
        </header>
        <section>
          <Calendar
            events={events}
            onChangeView={() => {}}
            onEventClick={(event) => {
              console.log('[DEBUG] onEventClick', event);
              setEditingTask({
                id: event.id,
                title: event.title,
                color: event.color,
                start: event.start,
                end: event.end,
              });
              setModalOpen(true);
            }}
            onCreateAtTime={(date) => {
              console.log('[DEBUG] onCreateAtTime', date);
              setEditingTask({
                id: '',
                title: '',
                start: date,
                end: new Date(date.getTime() + 60 * 60 * 1000),
                color: '#6366f1',
              });
              setModalOpen(true);
            }}
            onEventDrop={handleEventDrop}>
            {/* Responsive calendar header row */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-2 mb-4">
              {/* Desktop: all triggers and right-aligned actions in one row */}
              <div
                className="hidden md:flex items-center w-full gap-2 overflow-x-auto scrollbar-none -mx-2 px-2 md:mx-0 md:px-0"
                style={{ WebkitOverflowScrolling: 'touch' }}>
                <CalendarPrevTrigger>{'<'}</CalendarPrevTrigger>
                <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                <CalendarNextTrigger>{'>'}</CalendarNextTrigger>
                <CalendarViewTrigger view="day">Day</CalendarViewTrigger>
                <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
                <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
                <CalendarViewTrigger view="year">Year</CalendarViewTrigger>
                <div className="ml-auto flex items-center gap-2">
                  <span className="font-semibold">
                    <CalendarCurrentDate />
                  </span>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                    onClick={() => {
                      setEditingTask(null);
                      setModalOpen(true);
                    }}
                    type="button">
                    + New Task
                  </button>
                </div>
              </div>
              {/* Mobile: nav triggers row */}
              <div
                className="flex md:hidden items-center gap-1 overflow-x-auto scrollbar-none -mx-2 px-2"
                style={{ WebkitOverflowScrolling: 'touch' }}>
                <CalendarPrevTrigger>{'<'}</CalendarPrevTrigger>
                <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                <CalendarNextTrigger>{'>'}</CalendarNextTrigger>
                <span className="ml-auto font-semibold">
                  <CalendarCurrentDate />
                </span>
              </div>
              {/* Mobile: view triggers row */}
              <div
                className="flex md:hidden items-center gap-1 mt-2 overflow-x-auto scrollbar-none -mx-2 px-2"
                style={{ WebkitOverflowScrolling: 'touch' }}>
                <CalendarViewTrigger view="day">Day</CalendarViewTrigger>
                <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
                <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
                <CalendarViewTrigger view="year">Year</CalendarViewTrigger>
              </div>
            </div>
            {/* Floating New Task button for mobile */}
            <button
              className="fixed bottom-6 right-6 z-50 md:hidden flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg w-14 h-14 text-3xl font-bold hover:bg-primary/90 transition-colors"
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
              type="button"
              aria-label="New Task">
              +
            </button>
            <div className="h-[80vh]">
              <CalendarDayView />
              <CalendarWeekView />
              <CalendarMonthView />
              <CalendarYearView />
            </div>
          </Calendar>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
