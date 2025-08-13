'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useUserData } from '@/components/data-context';
import { Goal } from '@/lib/types';

// Date utilities
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

const subDays = (date: string | number | Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const startOfDay = (date: string | number | Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

function OverviewPage() {
  const { tasks, habits, goals, refreshAll } = useUserData();

  // Quick stats
  const todayTasks = tasks.filter((task) => isToday(new Date(task.start)));
  const completedToday = todayTasks.filter((task) => task.completed).length;
  const completedHabitsToday = habits.filter(
    (habit) =>
      isToday(new Date(habit.completedAt)) &&
      habit.completedAt !== habit.createdAt
  ).length;

  // Activity graph data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), i));
    const completedTasks = tasks.filter(
      (task) =>
        task.completed &&
        startOfDay(new Date(task.end)).getTime() === date.getTime()
    ).length;
    const completedHabits = habits.filter(
      (habit) =>
        startOfDay(new Date(habit.completedAt)).getTime() === date.getTime()
    ).length;

    return {
      date: format(date, 'EEE'),
      tasks: completedTasks,
      habits: completedHabits,
      total: completedTasks + completedHabits,
    };
  }).reverse();

  // Goals progress calculation
  const calculateProgress = (goal: Goal) => {
    const totalTasks = goal.tasks.length;
    const completedTasks = goal.tasks.filter((task) => task.completed).length;
    const hasHabits = goal.habits.length > 0;
    const habitProgress = goal.habits.reduce(
      (acc, habit) => acc + Math.min(habit.streak / 7, 1),
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

  const handleTaskComplete = async (taskId: string, completed: string | boolean) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selectedTask, completed }),
    });
    refreshAll();
  };

  const handleHabitComplete = async (habitId: string, completed: string | boolean) => {
    if (!completed) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    await fetch(`/api/habits/${habitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...habit,
        streak: habit.streak + 1,
        completedAt: new Date(),
      }),
    });
    refreshAll();
  };

  const upcomingTasks = tasks
    .filter((task) => new Date(task.end) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header with simple stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold">{completedToday}</div>
            <div className="text-muted-foreground">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completedHabitsToday}</div>
            <div className="text-muted-foreground">Habits Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {goals.length
                ? Math.round(
                    goals.reduce(
                      (acc, goal) => acc + calculateProgress(goal),
                      0
                    ) / goals.length
                  )
                : 0}
              %
            </div>
            <div className="text-muted-foreground">Goals Progress</div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-muted-foreground">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 group">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleTaskComplete(task.id, checked)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        task.completed
                          ? 'line-through text-muted-foreground'
                          : ''
                      }`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(task.start), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: task.color || '#888888' }}
                  />
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Today's Habits */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Habits</h2>
          <div className="space-y-3">
            {!habits || habits.length === 0 ? (
              <p className="text-muted-foreground">
                No habits to complete today
              </p>
            ) : (
              habits.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={habit.id}
                    checked={
                      isToday(new Date(habit.completedAt)) &&
                      habit.completedAt !== habit.createdAt
                    }
                    onCheckedChange={(checked) =>
                      handleHabitComplete(habit.id, checked)
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">{habit.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        🔥 {habit.streak} day streak
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {habit.frequency.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Goals Progress</h2>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <p className="text-muted-foreground">No goals created yet</p>
            ) : (
              goals.map((goal) => {
                const progress = calculateProgress(goal);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{goal.name}</p>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Activity Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">7-Day Activity</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Activities"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  name="Tasks"
                  stroke="#82ca9d"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="habits"
                  name="Habits"
                  stroke="#ffc658"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default OverviewPage;
