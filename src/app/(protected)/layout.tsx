'use client';

import { Navbar } from '@/components/navbar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { AuthButtons } from '@/components/auth-buttons';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Task } from '@/lib/types';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[] | null>(null);

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


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Navbar - responsive positioning */}
      <div className="lg:flex-shrink-0">
        <Navbar tasks={tasks || []} />
      </div>

      {/* Main content - responsive layout */}
      <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">
        {/* Header - only show on larger screens since navbar handles mobile */}
        <header className="hidden lg:block flex-shrink-0 px-4 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="text-4xl font-black capitalize">
              {/* Get the last segment of the URL path as the page title */}
              {decodeURIComponent(usePathname().split('/').pop() || 'Overview')}
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
  );
}
