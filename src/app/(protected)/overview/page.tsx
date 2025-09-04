'use client';
import React from 'react';
import { useUserData } from '@/components/data-context';
import { Goal, Task, Habit } from '@/lib/types';
import { DashboardHeader } from '@/components/overview/dashboard-header';
import { UpcomingTasks } from '@/components/overview/upcoming-tasks';
import { TodaysHabits } from '@/components/overview/today-habits';
import { GoalsProgress } from '@/components/overview/goals-progress';
import { ActivityChart } from '@/components/overview/activity-graph';
import { useSession } from 'next-auth/react';

const format = (date: string | number | Date, formatStr: string) => {
  const d = new Date(date);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthsFull = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (formatStr === 'EEEE, MMMM d, yyyy') {
    return `${days[d.getDay()]}, ${
      monthsFull[d.getMonth()]
    } ${d.getDate()}, ${d.getFullYear()}`;
  }
  if (formatStr === 'MMM d, h:mm a') {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${months[d.getMonth()]} ${d.getDate()}, ${displayHours}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;
  }
  if (formatStr === 'EEE') {
    return days[d.getDay()];
  }
  return d.toLocaleDateString();
};

const isToday = (date: string | number | Date) => {
  const today = new Date();
  const d = new Date(date);
  return today.toDateString() === d.toDateString();
};

function OverviewPage() {
  const { tasks, habits, goals, updateTask, updateHabit } = useUserData();
  const { data } = useSession();

  // Quick stats
  const todayTasks = tasks.filter((task) => isToday(new Date(task.start)));
  const completedToday = todayTasks.filter((task) => task.completed).length;
  const completedHabitsToday = habits.filter(
    (habit) =>
      isToday(new Date(habit.completedAt)) &&
      habit.completedAt !== habit.createdAt
  ).length;

  const calculateGoalProgress = (goal: Goal) => {
    const totalTasks = goal?.tasks?.length ?? 0;
    const completedTasks = goal?.tasks?.filter(
      (task: Task) => task.completed
    ).length;
    const hasHabits = goal?.habits?.length > 0;
    const habitProgress = goal?.habits?.reduce(
      (acc: number, habit: Habit) => acc + Math.min(habit.streak / 7, 1),
      0
    );

    if (totalTasks === 0 && !hasHabits) return 0;
    if (totalTasks === 0) return (habitProgress / goal.habits.length) * 100;
    if (!hasHabits) return (completedTasks / totalTasks) * 100;

    return (
      ((completedTasks / totalTasks) * 0.6 +
        (habitProgress / goal.habits.length) * 0.4) *
      100
    );
  };

  const goalsProgress = goals.length
    ? Math.round(
        goals.reduce((acc, goal) => acc + calculateGoalProgress(goal), 0) /
          goals.length
      )
    : 0;

  const handleTaskComplete = async (
    taskId: string,
    completed: boolean | string
  ) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    // Ensure completed is a boolean
    const completedBool =
      typeof completed === 'boolean' ? completed : completed === 'true';
    await updateTask(taskId, { completed: completedBool });
  };

  const handleHabitComplete = async (
    habitId: string,
    completed: boolean | string
  ) => {
    if (!completed) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    await updateHabit(habitId, {
      streak: habit.streak + 1,
      completedAt: new Date(),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <DashboardHeader
        completedToday={completedToday}
        completedHabitsToday={completedHabitsToday}
        goalsProgress={goalsProgress}
        userName={data?.user?.name ?? ''}
        format={format}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingTasks
          tasks={tasks}
          onTaskComplete={handleTaskComplete}
          format={format}
        />
        <TodaysHabits
          habits={habits}
          onHabitComplete={handleHabitComplete}
          isToday={isToday}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalsProgress goals={goals} />
        <ActivityChart tasks={tasks} habits={habits} />
      </div>
    </div>
  );
}

export default OverviewPage;
