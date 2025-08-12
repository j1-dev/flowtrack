'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

import UpcomingTasks from '@/components/overview/upcoming-tasks';
import TodayHabits from '@/components/overview/today-habits';
import GoalsProgress from '@/components/overview/goals-progress';
import ActivityGraph from '@/components/overview/activity-graph';
import { useCalendar } from '@/components/ui/full-calendar';
import { useUserData } from '@/components/data-context';

function OverviewPage() {
  const { events } = useCalendar();
  const { habits, goals } = useUserData();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <UpcomingTasks tasks={events} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Habits</h2>
          <TodayHabits habits={habits} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Goals Progress</h2>
          <GoalsProgress goals={goals} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
          <ActivityGraph tasks={events} habits={habits} />
        </Card>
      </div>
    </div>
  );
}

export default OverviewPage;
