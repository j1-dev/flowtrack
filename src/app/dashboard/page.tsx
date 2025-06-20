'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthButtons } from '@/components/auth-buttons';
import { ThemeSwitcher } from '@/components/theme-switcher';
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
} from '@/components/ui/full-calendar';
import { type CalendarEvent } from '@/components/ui/full-calendar';
import { Task } from '@/lib/types';

const DashboardPage: FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState<
    'default' | 'blue' | 'green' | 'pink' | 'purple'
  >('default');
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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
            color: 'default',
          }))
        );
      });
  }, []);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, startTime, endTime, color }),
    });
    const newTask = await res.json();
    if (!title || !startTime || !endTime) return;
    const newEvent: CalendarEvent = {
      id: newTask.id,
      start: new Date(startTime),
      end: new Date(endTime),
      title,
      color,
    };
    setEvents((prev) => [...prev, newEvent]);
    setTitle('');
    setStartTime('');
    setEndTime('');
    setColor('default');
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-80 min-w-[260px] max-w-xs bg-card border-r border-border h-screen p-0 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold mb-4">Create Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              required
            />
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              required
            />
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              required
            />
            <select
              value={color}
              onChange={(e) =>
                setColor(
                  e.target.value as
                    | 'default'
                    | 'blue'
                    | 'green'
                    | 'pink'
                    | 'purple'
                )
              }
              className="w-full p-2 rounded bg-background border">
              <option value="default">Default</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
            </select>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded">
              Create Task
            </button>
          </form>
        </div>
      </aside>
      {/* Main Calendar Section */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <AuthButtons />
          </div>
        </header>
        <section >
          <Calendar
            events={events}
            onChangeView={() => {}}
            onEventClick={(event) => handleDelete(event.id)}>
            <div className="flex items-center gap-2 mb-4">
              <CalendarPrevTrigger>{'<'}</CalendarPrevTrigger>
              <CalendarTodayTrigger>Today</CalendarTodayTrigger>
              <CalendarNextTrigger>{'>'}</CalendarNextTrigger>
              <CalendarViewTrigger view="day">Day</CalendarViewTrigger>
              <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
              <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
              <CalendarViewTrigger view="year">Year</CalendarViewTrigger>
              <span className="ml-auto font-semibold">
                <CalendarCurrentDate />
              </span>
            </div>
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
