'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Home, Menu, CalendarDays, CheckSquare, Plus, X } from 'lucide-react';
import { Task } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';

interface NavbarProps {
  onCreateTask: () => void;
  tasks?: Task[];
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateTask, tasks = [] }) => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  // Filter tasks that are coming up (next 7 days)
  const upcomingTasks = tasks
    .filter((task) => {
      const taskDate = new Date(task.start);
      const today = new Date();
      const inSevenDays = new Date();
      inSevenDays.setDate(today.getDate() + 7);
      return taskDate >= today && taskDate <= inSevenDays;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="">
      {/* Mobile menu button (fixed, top left) */}
      <button
        className="w-6 h-6 absolute top-[30px] left-4 z-40 md:hidden p-2"
        onClick={() => setOpen(true)}
        aria-label="Open menu">
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Sidebar: always visible on desktop, drawer on mobile */}
      <nav
        className={`fixed top-0 left-0 h-screen bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:flex
          ${collapsed ? 'w-16' : 'w-64'} md:transition-all md:translate-x-0`}
        aria-label="Sidebar">
        <div className="h-full flex flex-col p-4">
          {/* Logo/Title */}
          <div className="flex items-center justify-between mb-6 pt-2">
            {!collapsed && (
              <h1 className="text-xl font-bold ml-2">FlowTrack</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:flex">
              {collapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
              <Home className="w-5 h-5" />
              {!collapsed && <span>Overview</span>}
            </Link>
            <Link
              href="/calendar"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
              <CalendarDays className="w-5 h-5" />
              {!collapsed && <span>Calendar</span>}
            </Link>
            <Link
              href="/habits"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
              <CheckSquare className="w-5 h-5" />
              {!collapsed && <span>Habits</span>}
            </Link>
          </nav>

          <>
            {/* Mini Calendar */}
            <div
              className={`mb-6 ${
                collapsed
                  ? 'opacity-0 -translate-x-60'
                  : 'opacity-100 translate-x-0'
              } transition-all ease-in duration-150`}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border scale-90 -translate-x-2"
              />
            </div>

            {/* Upcoming Tasks */}
            <div
              className={`flex-1 overflow-auto ${
                collapsed
                  ? 'opacity-0 -translate-x-60'
                  : 'opacity-100 translate-x-0'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold ml-2">Upcoming Tasks</h2>
                <Button variant="ghost" size="icon" onClick={onCreateTask}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 rounded-lg bg-accent/50 hover:bg-accent cursor-pointer"
                    style={{
                      borderLeft: `4px solid ${task.color || '#888'}`,
                    }}>
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(task.start), 'MMM d, h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        </div>
      </nav>
    </div>
  );
};
