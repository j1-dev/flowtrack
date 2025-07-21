'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthButtons } from '@/components/auth-buttons';
import { ThemeSwitcher } from '@/components/theme-switcher';
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
} from '@/components/ui/full-calendar/index';
import { Task } from '@/lib/types';
import { Navbar } from '@/components/navbar';

const DashboardPage: FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=/dashboard`);
    }

    // Initialize width and mobile state
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setIsMobile(newWidth < 768);
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [status, router]);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(
          data.map((task: Task) => ({
            ...task,
            start: new Date(task.start),
            end: new Date(task.end),
          }))
        );
      });
  }, []);

  const handleSaveTask = async (task: Task) => {
    if (!task.title || !task.start || !task.end) return;
    if (task.id) {
      // Optimistically update existing event
      let prevEvents: Task[] = [];
      setTasks((prev) => {
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
        setTasks((prev) =>
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
        setTasks(prevEvents);
      }
    } else {
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
      setTasks((prev) => {
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
        setTasks((prev) =>
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
        setTasks(prevEvents);
      }
    }
    setEditingTask(null);
    setModalOpen(false);
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

  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((e) => e.id !== id));
    setEditingTask(null);
    setModalOpen(false);
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Navbar - responsive positioning */}
      <div className="lg:flex-shrink-0">
        <Navbar tasks={tasks} />
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={(task) => handleDeleteTask(task.id)}
        initialTask={editingTask}
      />

      {/* Main content - responsive layout */}
      <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">
        {/* Header - only show on larger screens since navbar handles mobile */}
        <header className="hidden lg:block flex-shrink-0 px-8 py-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black">Dashboard</h1>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <AuthButtons />
            </div>
          </div>
        </header>

        {/* Calendar section - responsive container */}
        <section className="flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 min-h-0 overflow-hidden">
          <Calendar
            events={tasks}
            onChangeView={() => {}}
            onEventClick={(event) => {
              console.log('[DEBUG] onEventClick', event);
              setEditingTask(event as Task);
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
              } as Task);
              setModalOpen(true);
            }}
            onEventDrop={handleEventDrop}
            onEventResize={(eventId, newEnd) => {
              console.log('[DEBUG] onEventResize: ', eventId);
              const event = tasks.find((e) => e.id === eventId);
              if (!event) return;
              const updatedTask = {
                ...event,
                end: newEnd,
              };
              handleSaveTask(updatedTask);
            }}>
            {/* Responsive calendar controls */}
            <div className="mb-4 space-y-3 sm:space-y-0">
              {/* Mobile: Stack controls vertically */}
              <div className="block sm:hidden space-y-3">
                {/* Current date display */}
                <div className="text-center">
                  <span className="text-lg font-semibold">
                    <CalendarCurrentDate />
                  </span>
                </div>

                {/* Navigation controls */}
                <div className="flex justify-center items-center gap-2">
                  <CalendarPrevTrigger className="px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors">
                    {'<'}
                  </CalendarPrevTrigger>
                  <CalendarTodayTrigger className="px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors font-medium">
                    Today
                  </CalendarTodayTrigger>
                  <CalendarNextTrigger className="px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors">
                    {'>'}
                  </CalendarNextTrigger>
                </div>

                {/* View toggles */}
                <div className="flex justify-center items-center gap-1">
                  <CalendarViewTrigger
                    view="day"
                    className="flex-1 max-w-16 px-2 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors text-center">
                    {width >= 400 ? 'Day' : 'D'}
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                    view="week"
                    className="flex-1 max-w-16 px-2 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors text-center">
                    {width >= 400 ? 'Week' : 'W'}
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                    view="month"
                    className="flex-1 max-w-16 px-2 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors text-center">
                    {width >= 400 ? 'Month' : 'M'}
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                    view="year"
                    className="flex-1 max-w-16 px-2 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors text-center">
                    {width >= 400 ? 'Year' : 'Y'}
                  </CalendarViewTrigger>
                </div>
              </div>

              {/* Desktop/Tablet: Single row layout */}
              <div className="hidden sm:flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CalendarPrevTrigger className="px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors">
                    {'<'}
                  </CalendarPrevTrigger>
                  <CalendarTodayTrigger className="px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors font-medium">
                    Today
                  </CalendarTodayTrigger>
                  <CalendarNextTrigger className="px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors">
                    {'>'}
                  </CalendarNextTrigger>

                  <div className="ml-4 flex items-center gap-1">
                    <CalendarViewTrigger
                      view="day"
                      className="px-3 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors">
                      {width >= 1024 ? 'Day' : 'D'}
                    </CalendarViewTrigger>
                    <CalendarViewTrigger
                      view="week"
                      className="px-3 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors">
                      {width >= 1024 ? 'Week' : 'W'}
                    </CalendarViewTrigger>
                    <CalendarViewTrigger
                      view="month"
                      className="px-3 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors">
                      {width >= 1024 ? 'Month' : 'M'}
                    </CalendarViewTrigger>
                    <CalendarViewTrigger
                      view="year"
                      className="px-3 py-2 rounded-md text-sm border border-border hover:bg-accent transition-colors">
                      {width >= 1024 ? 'Year' : 'Y'}
                    </CalendarViewTrigger>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg">
                    <CalendarCurrentDate />
                  </span>
                  <button
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
                    onClick={openNewTaskModal}
                    type="button">
                    {width >= 1024 ? '+ New Task' : '+ Task'}
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar views container - responsive height */}
            <div
              className="flex-1 min-h-0"
              style={{
                height: isMobile
                  ? 'calc(100vh - 280px)' // Account for mobile header + controls
                  : 'calc(100vh - 240px)', // Account for desktop header + controls
              }}>
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
