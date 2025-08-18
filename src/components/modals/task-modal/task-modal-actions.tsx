import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Task } from '@/lib/types';

interface TaskModalActionsProps {
  initialTask?: Task | null;
  onDelete?: (task: Task) => void;
  onSave?: (task: Task) => void;
}

export const TaskModalActions: React.FC<TaskModalActionsProps> = ({
  initialTask,
  onDelete,
  onSave,
}) => {
  return (
    <>
      {!initialTask?.completed && (
        <Button type="submit">
          {initialTask?.id ? 'Save Changes' : 'Create Task'}
        </Button>
      )}
      {initialTask?.id && (
        <div>
          <Button
            className="absolute left-6 bottom-6"
            type="button"
            variant="destructive"
            onClick={() => onDelete?.(initialTask)}>
            Delete task
          </Button>

          {!initialTask.completed && (
            <Button
              className="absolute left-36 bottom-6"
              type="button"
              onClick={() => onSave?.({ ...initialTask, completed: true })}>
              Complete
            </Button>
          )}
        </div>
      )}
      <DialogClose asChild>
        <Button type="button" variant="ghost">
          Cancel
        </Button>
      </DialogClose>
    </>
  );
};
