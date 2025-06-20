'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/components/ui/full-calendar';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  initialTask?: CalendarEvent | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState<
    'default' | 'blue' | 'green' | 'pink' | 'purple'
  >('default');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setStartTime(initialTask.start.toISOString().slice(0, 16));
      setEndTime(initialTask.end.toISOString().slice(0, 16));
      setColor(initialTask.color || 'default');
    } else {
      setTitle('');
      setStartTime('');
      setEndTime('');
      setColor('default');
    }
  }, [initialTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;
    onSave({
      id: initialTask?.id,
      title,
      start: new Date(startTime),
      end: new Date(endTime),
      color,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-background border"
            required
          />
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 rounded bg-background border"
            required
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 rounded bg-background border"
            required
          />
          <select
            value={color}
            onChange={(e) =>
              setColor(
                e.target.value as
                  | 'default'
                  | 'blue'
                  | 'green'
                  | 'pink'
                  | 'purple'
              )
            }
            className="w-full p-2 rounded bg-background border">
            <option value="default">Default</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
          </select>
          <DialogFooter>
            <Button type="submit">
              {initialTask ? 'Save Changes' : 'Create Task'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
