'use client';

import React from 'react';
import { Habit } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { isToday } from 'date-fns';
import { useUserData } from '../data-context';

interface TodayHabitsProps {
  habits: Habit[];
}

function TodayHabits({ habits }: TodayHabitsProps) {
  const { refreshAll } = useUserData();

  const handleHabitComplete = async (habitId: string, completed: boolean) => {
    if (completed) {
      // await updateHabitById(habitId, {
      //   streak: habits.find((h) => h.id === habitId)?.streak || 0 + 1,
      //   completedAt: new Date(),
      // });
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;
      await fetch(`/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...habit,
          streak: habit.streak || 0 + 1,
          completedAt: new Date(),
        }),
      });
      refreshAll();
    }
  };

  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <p className="text-muted-foreground">No habits to complete today</p>
      ) : (
        habits.map((habit) => (
          <div key={habit.id} className="flex items-center space-x-4">
            <Checkbox
              id={habit.id}
              checked={
                isToday(new Date(habit.completedAt)) &&
                habit.completedAt !== habit.createdAt
              }
              onCheckedChange={(checked) =>
                handleHabitComplete(habit.id, checked as boolean)
              }
            />
            <div className="flex-1">
              <p className="font-medium">{habit.name}</p>
              <p className="text-sm text-muted-foreground">
                Streak: {habit.streak} days
              </p>
            </div>
            <div className="text-sm font-medium">
              {habit.frequency.toLowerCase()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TodayHabits;
