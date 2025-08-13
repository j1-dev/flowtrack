import React from 'react';
import { Task, Habit } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { subDays, format, startOfDay } from 'date-fns';
import { Card } from '../ui/card';

interface ActivityChartProps {
  tasks: Task[];
  habits: Habit[];
}

export function ActivityChart({ tasks, habits }: ActivityChartProps) {
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

  return (
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
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
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
  );
}
