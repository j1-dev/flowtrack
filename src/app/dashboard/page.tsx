'use client';

import React, { FC, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthButtons } from '@/components/auth-buttons';
import { ThemeSwitcher } from '@/components/theme-switcher';

const DashboardPage: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not authenticated, redirect to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=/dashboard`);
    }
  }, [status, router]);

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
        <p className="mb-6">
          This is your dashboard. Use the sidebar or navigation to explore the
          app.
        </p>

        {/* Example content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-card rounded-lg shadow">
            <h3 className="font-medium mb-2">Your Tasks</h3>
            <p>Placeholder for tasks list.</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow">
            <h3 className="font-medium mb-2">Your Habits</h3>
            <p>Placeholder for habit tracker.</p>
          </div>
        </section>
      </main>

      <footer className="p-4 text-center bg-card text-muted">
        © {new Date().getFullYear()} Flowtrack
      </footer>
    </div>
  );
};

export default DashboardPage;
