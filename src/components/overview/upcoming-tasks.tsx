import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import { Task } from '@/lib/types';
interface UpcomingTasksProps {
  tasks: Task[];
  onTaskComplete: (taskId: string, completed: string | boolean) => void;
  format: (date: string | number | Date, formatStr: string) => string;
}

export function UpcomingTasks({
  tasks,
  onTaskComplete,
  format,
}: UpcomingTasksProps) {
  const upcomingTasks = tasks
    .filter((task) => new Date(task.end) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
      <div className="space-y-3">
        {upcomingTasks.length === 0 ? (
          <p className="text-muted-foreground">No upcoming tasks</p>
        ) : (
          upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={(checked) => onTaskComplete(task.id, checked)}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate ${
                    task.completed ? 'line-through text-muted-foreground' : ''
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
  );
}
