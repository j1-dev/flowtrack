'use client';

import { Navbar } from '@/components/navbar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { AuthButtons } from '@/components/auth-buttons';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Task } from '@/lib/types';
import { Calendar } from '@/components/ui/full-calendar/Calendar';
import { TaskModal } from '@/components/task-modal';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleUpcomingEventClick = (task: Task): void => {
    console.log(task);
    setEditingTask(task);
    setModalOpen(true);
  };

  // const openNewTaskModal = () => {
  //   setEditingTask(null);
  //   setModalOpen(true);
  // };

  return (
    <Calendar
      events={tasks || []}
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
        const event = tasks?.find((e) => e.id === eventId);
        if (!event) return;
        const updatedTask = {
          ...event,
          end: newEnd,
        };
        handleSaveTask(updatedTask);
      }}>
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
      <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
        {/* Navbar - responsive positioning */}
        <div className="lg:flex-shrink-0">
          <Navbar
            tasks={tasks}
            onUpcomingEventClick={handleUpcomingEventClick}
          />
        </div>

        {/* Main content - responsive layout */}
        <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">
          {/* Header - only show on larger screens since navbar handles mobile */}
          <header className="hidden lg:block flex-shrink-0 px-4 pt-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-black capitalize">
                {/* Get the last segment of the URL path as the page title */}
                {decodeURIComponent(
                  usePathname().split('/').pop() || 'Overview'
                )}
              </div>
              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                <AuthButtons />
              </div>
            </div>
          </header>

          {/* Content section */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 min-h-0 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </Calendar>
  );
}
