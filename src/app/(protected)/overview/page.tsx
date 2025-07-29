'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import UpcomingTasks from '@/components/overview/upcoming-tasks';
import TodayHabits from '@/components/overview/today-habits';
import GoalsProgress from '@/components/overview/goals-progress';
import ActivityGraph from '@/components/overview/activity-graph';
import { Task, Habit, Goal } from '@/lib/types';

function OverviewPage() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<
    (Goal & { tasks: Task[]; habits: Habit[] })[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, habitsRes, goalsRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/habits'),
          fetch('/api/goals'),
        ]);

        if (!tasksRes.ok || !habitsRes.ok || !goalsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [taskData, habitData, goalData] = await Promise.all([
          tasksRes.json(),
          habitsRes.json(),
          goalsRes.json(),
        ]);

        setTasks(taskData);
        setHabits(habitData);
        setGoals(goalData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [session]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <UpcomingTasks tasks={tasks} />
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
          <ActivityGraph tasks={tasks} habits={habits} />
        </Card>
      </div>
    </div>
  );
}

export default OverviewPage;
