'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthButtons } from '@/components/auth-buttons';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Task } from '@/lib/types';

const DashboardPage: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=/dashboard`);
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/tasks')
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json();
            console.error('Fetch tasks failed:', res.status, body);
            return [];
          }
          return res.json();
        })
        .then((data) => setTasks(data))
        .catch((err) => console.error('Fetch error:', err));
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, startTime, endTime, color }),
    });
    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    setTitle('');
    setStartTime('');
    setEndTime('');
    setColor('');
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((task: Task) => {
    const now = new Date();
    const taskStart = new Date(task.startTime);
    if (view === 'day') {
      return taskStart.toDateString() === now.toDateString();
    } else if (view === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return taskStart >= weekStart && taskStart < weekEnd;
    } else {
      return (
        taskStart.getMonth() === now.getMonth() &&
        taskStart.getFullYear() === now.getFullYear()
      );
    }
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="flex justify-between items-center p-6 bg-card shadow">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <AuthButtons />
        </div>
      </header>

      <main className="p-8">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {session?.user?.name || 'User'}!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form - 1/3 width */}
          <div className="md:col-span-1 p-4 bg-card rounded-lg shadow">
            <h3 className="font-medium mb-2">Create New Task</h3>
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
                type="date"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 rounded bg-background border"
                required
              />
              <input
                type="date"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 rounded bg-background border"
                required
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2 rounded bg-background border"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded">
                Create Task
              </button>
            </form>
          </div>

          {/* Task List - 2/3 width */}
          <div className="md:col-span-2 p-4 bg-card rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Your Tasks</h3>
              <div className="space-x-2">
                <button
                  onClick={() => setView('day')}
                  className={`px-2 py-1 rounded ${
                    view === 'day' ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                  Day
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-2 py-1 rounded ${
                    view === 'week' ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-2 py-1 rounded ${
                    view === 'month' ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                  Month
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {filteredTasks.map((task: Task) => (
                <li
                  key={task.id}
                  className="p-3 rounded border"
                  style={{ backgroundColor: task.color || '#f0f0f0' }}>
                  <div className="flex justify-between">
                    <div>
                      <strong>{task.title}</strong>
                      <br />
                      <span>
                        {new Date(task.startTime).toLocaleString()} -{' '}
                        {new Date(task.endTime).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-sm text-red-500">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center bg-card text-muted">
        © {new Date().getFullYear()} Flowtrack
      </footer>
    </div>
  );
};

export default DashboardPage;
