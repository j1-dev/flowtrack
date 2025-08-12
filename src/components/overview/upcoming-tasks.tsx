'use client';

import React from 'react';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserData } from '../data-context';

interface UpcomingTasksProps {
  tasks: Task[];
}

function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const { refreshAll } = useUserData();
  const upcomingTasks = tasks
    .filter((task) => new Date(task.end) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...selectedTask,
        id: taskId,
        completed: completed,
      }),
    });
    refreshAll();
  };

  return (
    <div className="space-y-4">
      {upcomingTasks.length === 0 ? (
        <p className="text-muted-foreground">No upcoming tasks</p>
      ) : (
        upcomingTasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-4">
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={(checked) =>
                handleTaskComplete(task.id, checked as boolean)
              }
            />
            <div className="flex-1">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(task.start), 'MMM d, h:mm a')}
              </p>
            </div>
            <div
              className={`w-2 h-2 rounded-full`}
              style={{ backgroundColor: task.color || '#888888' }}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default UpcomingTasks;
