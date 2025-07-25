'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Home, Menu, CalendarDays, CheckSquare, X } from 'lucide-react';
import { Task } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useCalendar } from '@/components/ui/full-calendar/Calendar';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  tasks: Task[];
  onUpcomingEventClick: (task: Task) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tasks = [],
  onUpcomingEventClick,
}) => {
  const router = useRouter();
  const { setView, setDate } = useCalendar();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date>(new Date());

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
    <>
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
          ${collapsed ? 'w-14' : 'w-63'} md:transition-all md:translate-x-0`}
        aria-label="Sidebar">
        <div className="h-full flex flex-col">
          {/* Logo/Title */}
          <div className="flex items-center justify-between mb-4 pt-5 ">
            {!collapsed && (
              <h1 className="text-2xl font-bold ml-4">FlowTrack</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:flex mx-2">
              {collapsed ? (
                <Menu className="w-9 h-9" />
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
          <Separator />
          {/* Navigation Links */}
          <nav className="space-y-2 mb-4 mx-2 pt-2">
            <Link
              href="/overview"
              className={`flex items-center space-x-3 ${
                collapsed
                  ? 'pt-3 p-1 pl-2'
                  : 'p-3 pl-2 border border-transparent hover:border-border hover:bg-accent '
              }rounded-lg `}>
              <Home className="w-7 h-7" />
              {!collapsed && <span>Overview</span>}
            </Link>
            <Link
              href="/calendar"
              className={`flex items-center space-x-3 ${
                collapsed
                  ? 'pt-3 p-1 pl-2'
                  : 'p-3 pl-2 border border-transparent hover:border-border hover:bg-accent '
              }rounded-lg `}>
              <CalendarDays className="w-7 h-7" />
              {!collapsed && <span>Calendar</span>}
            </Link>
            <Link
              href="/habits"
              className={`flex items-center space-x-3 ${
                collapsed
                  ? 'pt-3 p-1 pl-2'
                  : 'p-3 pl-2 border border-transparent hover:border-border hover:bg-accent '
              }rounded-lg `}>
              <CheckSquare className="w-7 h-7" />
              {!collapsed && <span>Habits</span>}
            </Link>
          </nav>
          <Separator className={collapsed ? 'hidden' : 'flex'} />
          <>
            {/* Mini Calendar */}
            <div
              className={` ${
                collapsed
                  ? 'opacity-0 -translate-x-60'
                  : 'opacity-100 translate-x-0'
              } transition-all ease-in duration-150 ml-2`}>
              <Calendar
                mode="single"
                selected={clickedDate}
                onSelect={(date) => {
                  if (date) {
                    console.log(date);
                    setClickedDate(date);
                    router.push('/calendar');
                    setView('day');
                    setDate(date);
                  }
                }}
                className="rounded-md border scale-90 -translate-x-2"
              />
            </div>
            <Separator className={collapsed ? 'hidden' : 'flex'} />

            {/* Upcoming Tasks */}
            <div
              className={`flex-1 overflow-auto ${
                collapsed
                  ? 'opacity-0 -translate-x-60'
                  : 'opacity-100 translate-x-0'
              }`}>
              <div className="flex items-center justify-between my-4">
                <h2 className="font-semibold ml-4">Upcoming Tasks</h2>
              </div>
              <div className="space-y-2 px-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 rounded-lg bg-accent/50 hover:bg-accent cursor-pointer"
                    onClick={() => onUpcomingEventClick(task)}
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
    </>
  );
};
