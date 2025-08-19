'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Task } from '@/lib/types';
import { useUserData } from '@/components/data-context';
import { TaskDetailsSection } from './task-details';
import { ScheduleSection } from './schedule';
import { OptionsSection } from './options';
import { ColorSelector } from './color-selector';
import { TaskModalActions } from './task-modal-actions';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (task: Task) => void;
  initialTask?: Task | null;
}

const pad = (n: number | string) => n.toString().padStart(2, '0');

const isFieldDisabled = (task: Task | null | undefined) => {
  return task?.completed || false;
};

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startHour, setStartHour] = useState('00');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('00');
  const [endMinute, setEndMinute] = useState('00');
  const [color, setColor] = useState<string>('#6366f1');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const { goals } = useUserData();

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setStartDate(new Date(initialTask.start));
      setEndDate(new Date(initialTask.end));
      setStartHour(pad(new Date(initialTask.start).getHours()));
      setStartMinute(pad(new Date(initialTask.start).getMinutes()));
      setEndHour(pad(new Date(initialTask.end).getHours()));
      setEndMinute(pad(new Date(initialTask.end).getMinutes()));
      setColor(initialTask.color || '#6366f1');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'MEDIUM');
      setSelectedGoalId(initialTask.goalId || null);
    } else {
      // Reset form
      setTitle('');
      setStartDate(undefined);
      setEndDate(undefined);
      setStartHour('00');
      setStartMinute('00');
      setEndHour('00');
      setEndMinute('00');
      setColor('#6366f1');
      setDescription('');
      setPriority('MEDIUM');
      setSelectedGoalId(null);
    }
  }, [initialTask, open]);

  // Auto-adjust end date/time when start date/time changes
  useEffect(() => {
    if (startDate && endDate) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(Number(startHour), Number(startMinute));

      const endDateTime = new Date(endDate);
      endDateTime.setHours(Number(endHour), Number(endMinute));

      // If end is before start, adjust end to match start
      if (endDateTime <= startDateTime) {
        setEndDate(new Date(startDate));
        setEndHour(startHour);
        setEndMinute(startMinute);
      }
    }
  }, [startDate, startHour, startMinute]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;

    const start = new Date(startDate);
    start.setHours(Number(startHour));
    start.setMinutes(Number(startMinute));
    start.setSeconds(0);
    start.setMilliseconds(0);

    const end = new Date(endDate);
    end.setHours(Number(endHour));
    end.setMinutes(Number(endMinute));
    end.setSeconds(0);
    end.setMilliseconds(0);

    // Final validation to ensure end is not before start
    if (end <= start) {
      // Automatically set end to be 1 hour after start
      end.setTime(start.getTime() + 60 * 60 * 1000);
    }

    onSave({
      id: initialTask?.id || '',
      title,
      start,
      end,
      color,
      description,
      priority,
      goalId: selectedGoalId,
    } as Task);
    onClose();
  };

  const disabled = isFieldDisabled(initialTask);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialTask?.id ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TaskDetailsSection
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            disabled={disabled}
          />

          <ScheduleSection
            startDate={startDate}
            endDate={endDate}
            startHour={startHour}
            startMinute={startMinute}
            endHour={endHour}
            endMinute={endMinute}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onStartHourChange={setStartHour}
            onStartMinuteChange={setStartMinute}
            onEndHourChange={setEndHour}
            onEndMinuteChange={setEndMinute}
            disabled={disabled}
          />

          <OptionsSection
            priority={priority}
            selectedGoalId={selectedGoalId}
            goals={goals}
            onPriorityChange={setPriority}
            onGoalChange={setSelectedGoalId}
            disabled={disabled}
          />

          <ColorSelector
            color={color}
            onColorChange={setColor}
            disabled={disabled}
          />

          <DialogFooter>
            <TaskModalActions
              initialTask={initialTask}
              onDelete={onDelete}
              onSave={onSave}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
