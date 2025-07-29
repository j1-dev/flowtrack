'use client';

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

interface ActivityGraphProps {
  tasks: Task[];
  habits: Habit[];
}

function ActivityGraph({ tasks, habits }: ActivityGraphProps) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
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
      date: format(date, 'MMM d'),
      tasks: completedTasks,
      habits: completedHabits,
      total: completedTasks + completedHabits,
    };
  }).reverse();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={last30Days}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Activities"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="tasks"
            name="Completed Tasks"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            dataKey="habits"
            name="Completed Habits"
            stroke="#ffc658"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityGraph;
