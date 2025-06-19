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
  const [tasks, setTasks] = useState<Task[]|[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=/dashboard`);
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error(err));
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
            <h3 className="font-medium mb-4">Your Tasks for Today</h3>
            <ul className="space-y-2">
              {tasks.map((task: Task) => (
                <li key={task.id} className="p-3 rounded border bg-muted">
                  <strong>{task.title}</strong>
                  <br />
                  <span>
                    {new Date(task.startTime).toLocaleString()} -{' '}
                    {new Date(task.endTime).toLocaleString()}
                  </span>
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
