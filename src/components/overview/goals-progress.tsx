'use client';

import React from 'react';
import { Goal } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface GoalsProgressProps {
  goals: Array<
    Goal & {
      tasks: { completed: boolean }[];
      habits: { streak: number }[];
    }
  >;
}

function GoalsProgress({ goals }: GoalsProgressProps) {
  const calculateProgress = (goal: GoalsProgressProps['goals'][0]) => {
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

  return (
    <div className="space-y-6">
      {goals.length === 0 ? (
        <p className="text-muted-foreground">No goals created yet</p>
      ) : (
        goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">{goal.name}</p>
              <span className="text-sm text-muted-foreground">
                {Math.round(calculateProgress(goal))}%
              </span>
            </div>
            <Progress value={calculateProgress(goal)} className="h-2" />
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default GoalsProgress;
