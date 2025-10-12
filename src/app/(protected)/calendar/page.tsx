'use client';

import React, { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
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
import Loading from '@/components/loading';

const CalendarPage: FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?next=/dashboard`);
    }

    // Initialize width and mobile state
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [status, router]);

  if (status === 'loading') {
    return <Loading text="Loading Calendar..." />;
  }

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">
        <section className="flex-1 px-4 sm:px-6 lg:px-0 py-4 lg:py-0 min-h-0 overflow-hidden">
          <div className="mb-4 space-y-3 sm:space-y-0">
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
              <span className="font-semibold text-lg">
                <CalendarCurrentDate />
              </span>
            </div>
          </div>

          {/* Calendar views container - responsive height */}
          <div className="flex-1 min-h-0">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </section>
      </main>
    </div>
  );
};

export default CalendarPage;
