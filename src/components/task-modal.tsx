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
import { Task } from '@/lib/types';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (task: Task) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  // Use hex color codes for color state
  const [color, setColor] = useState<string>('#6366f1'); // Default to indigo-500

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setStartTime(toLocalDateTimeInputValue(initialTask.start));
      setEndTime(toLocalDateTimeInputValue(initialTask.end));
      setColor(initialTask.color || '#6366f1');
    } else {
      setTitle('');
      setStartTime('');
      setEndTime('');
      setColor('#6366f1');
    }
  }, [initialTask, open]);

  function toLocalDateTimeInputValue(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes())
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;
    onSave({
      id: initialTask?.id || '',
      title,
      start: new Date(startTime),
      end: new Date(endTime),
      color,
    } as Task);
    onClose();
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialTask?.id ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
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
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 rounded bg-background border">
            <option value="#6366f1">Indigo</option>
            <option value="#3b82f6">Blue</option>
            <option value="#10b981">Green</option>
            <option value="#ec4899">Pink</option>
            <option value="#a21caf">Purple</option>
            <option value="#f59e42">Orange</option>
            <option value="#f43f5e">Red</option>
            <option value="#fbbf24">Yellow</option>
            <option value="#22d3ee">Cyan</option>
            <option value="#64748b">Slate</option>
          </select>
          <DialogFooter>
            <Button type="submit">
              {initialTask?.id ? 'Save Changes' : 'Create Task'}
            </Button>
            {initialTask?.id && (
              <Button
                className='absolute left-6 bottom-6'
                type="button"
                variant="destructive"
                onClick={() => onDelete?.(initialTask)}>
                Delete task
              </Button>
            )}
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
