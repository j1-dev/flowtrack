import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {  Habit } from '@/lib/types';
interface TodaysHabitsProps {
  habits: Habit[];
  onHabitComplete: (habitId: string, completed: string | boolean) => void;
  isToday: (date: Date) => boolean;
}

export function TodaysHabits({ habits, onHabitComplete, isToday }: TodaysHabitsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Today&apos;s Habits</h2>
      <div className="space-y-3">
        {!habits || habits.length === 0 ? (
          <p className="text-muted-foreground">No habits to complete today</p>
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
                  onHabitComplete(habit.id, checked)
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
  );
}
