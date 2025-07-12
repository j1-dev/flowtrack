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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startHour, setStartHour] = useState('00');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('00');
  const [endMinute, setEndMinute] = useState('00');
  // Use hex color codes for color state
  const [color, setColor] = useState<string>('#6366f1'); // Default to indigo-500
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [recurrence, setRecurrence] = useState('');
  const [showRecurrence, setShowRecurrence] = useState(false);

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
      setRecurrence(initialTask.recurrence || '');
    } else {
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
      setRecurrence('');
    }
  }, [initialTask, open]);

  function pad(n: number | string) {
    return n.toString().padStart(2, '0');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;
    // Compose start and end Date objects with selected time
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
    onSave({
      id: initialTask?.id || '',
      title,
      start,
      end,
      color,
      description,
      priority,
      recurrence,
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
          {/* Task Details Section */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Title</Label>
            <Input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Description</Label>
            <Textarea
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              rows={2}
            />
          </div>

          {/* Schedule Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="block text-sm font-medium">Start</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {startDate ? startDate.toLocaleDateString() : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex gap-2 mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-14 justify-between">
                      {startHour}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-14 p-1 grid grid-cols-2 gap-1">
                    {[...Array(24).keys()].map((h) => (
                      <DropdownMenuItem
                        key={h}
                        onSelect={() => setStartHour(pad(h))}>
                        {pad(h)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="self-center">:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-14 justify-between">
                      {startMinute}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-14 p-1 grid grid-cols-2 gap-1">
                    {[...Array(12).keys()].map((i) => (
                      <DropdownMenuItem
                        key={i}
                        onSelect={() => setStartMinute(pad(i * 5))}>
                        {pad(i * 5)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium">End</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {endDate ? endDate.toLocaleDateString() : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </PopoverContent>
              </Popover>
              <div className="flex gap-2 mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-14 justify-between">
                      {endHour}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-14 p-1 grid grid-cols-2 gap-1">
                    {[...Array(24).keys()].map((h) => (
                      <DropdownMenuItem
                        key={h}
                        onSelect={() => setEndHour(pad(h))}>
                        {pad(h)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="self-center">:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-14 justify-between">
                      {endMinute}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-14 p-1 grid grid-cols-2 gap-1">
                    {[...Array(12).keys()].map((i) => (
                      <DropdownMenuItem
                        key={i}
                        onSelect={() => setEndMinute(pad(i * 5))}>
                        {pad(i * 5)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="block text-sm font-medium">Priority</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {priority === 'LOW'
                      ? 'Low'
                      : priority === 'HIGH'
                      ? 'High'
                      : 'Medium'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[8rem]">
                  <DropdownMenuItem onSelect={() => setPriority('LOW')}>
                    Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setPriority('MEDIUM')}>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setPriority('HIGH')}>
                    High
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={showRecurrence}
                  onCheckedChange={(val) => setShowRecurrence(val === true)}
                  className="accent-primary"
                />
                Recurrence
              </Label>
              {showRecurrence && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between">
                      {recurrence
                        ? recurrence.charAt(0).toUpperCase() +
                          recurrence.slice(1)
                        : 'Select recurrence'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[8rem]">
                    <DropdownMenuItem onSelect={() => setRecurrence('Daily')}>
                      Daily
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setRecurrence('Weekly')}>
                      Weekly
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setRecurrence('Monthly')}>
                      Monthly
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Color Picker Section */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Color</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {(() => {
                      switch (color) {
                        case '#6366f1':
                          return 'Indigo';
                        case '#3b82f6':
                          return 'Blue';
                        case '#10b981':
                          return 'Green';
                        case '#ec4899':
                          return 'Pink';
                        case '#a21caf':
                          return 'Purple';
                        case '#f59e42':
                          return 'Orange';
                        case '#f43f5e':
                          return 'Red';
                        case '#fbbf24':
                          return 'Yellow';
                        case '#22d3ee':
                          return 'Cyan';
                        case '#64748b':
                          return 'Slate';
                        default:
                          return 'Custom';
                      }
                    })()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[8rem] grid grid-cols-2 gap-1 p-2">
                <DropdownMenuItem onSelect={() => setColor('#6366f1')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#6366f1' }}
                  />
                  Indigo
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#3b82f6')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#3b82f6' }}
                  />
                  Blue
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#10b981')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#10b981' }}
                  />
                  Green
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#ec4899')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#ec4899' }}
                  />
                  Pink
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#a21caf')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#a21caf' }}
                  />
                  Purple
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#f59e42')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#f59e42' }}
                  />
                  Orange
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#f43f5e')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#f43f5e' }}
                  />
                  Red
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#fbbf24')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#fbbf24' }}
                  />
                  Yellow
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#22d3ee')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#22d3ee' }}
                  />
                  Cyan
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColor('#64748b')}>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#64748b' }}
                  />
                  Slate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DialogFooter>
            <Button type="submit">
              {initialTask?.id ? 'Save Changes' : 'Create Task'}
            </Button>
            {initialTask?.id && (
              <Button
                className="absolute left-6 bottom-6"
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
