import { Goal } from '@/lib/types';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

// Goals Progress Component
interface GoalsProgressProps {
  goals: Goal[];
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
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

  return (
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
  );
}
