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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Goal, Habit } from '@/lib/types';

interface HabitModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
  initialHabit?: Habit | null;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>(
    'DAILY'
  );
  const [streak, setStreak] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Fetch goals when modal opens
  useEffect(() => {
    if (open) {
      fetch('/api/goals')
        .then((res) => res.json())
        .then((data) => setGoals(data))
        .catch((error) => console.error('Error fetching goals:', error));
    }
  }, [open]);

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setFrequency(initialHabit.frequency);
      setStreak(initialHabit.streak || 0);
      setSelectedGoalId(initialHabit.goalId || null);
    } else {
      setName('');
      setFrequency('DAILY');
      setStreak(0);
      setSelectedGoalId(null);
    }
  }, [initialHabit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSave({
      id: initialHabit?.id || '',
      name,
      frequency,
      streak,
      goalId: selectedGoalId,
    } as Habit);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialHabit?.id ? 'Edit Habit' : 'Create Habit'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Habit Details Section */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Name</Label>
            <Input
              type="text"
              placeholder="Habit name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              required
            />
          </div>

          {/* Frequency Section */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Frequency</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {frequency === 'DAILY'
                    ? 'Daily'
                    : frequency === 'WEEKLY'
                    ? 'Weekly'
                    : 'Monthly'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[8rem]">
                <DropdownMenuItem onSelect={() => setFrequency('DAILY')}>
                  Daily
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFrequency('WEEKLY')}>
                  Weekly
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFrequency('MONTHLY')}>
                  Monthly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Goal Section */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Goal</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {goals.find((g) => g.id === selectedGoalId)?.name ||
                    'No goal'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[8rem]">
                <DropdownMenuItem onSelect={() => setSelectedGoalId(null)}>
                  No goal
                </DropdownMenuItem>
                {goals.map((goal) => (
                  <DropdownMenuItem
                    key={goal.id}
                    onSelect={() => setSelectedGoalId(goal.id)}>
                    {goal.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DialogFooter>
            <Button type="submit">
              {initialHabit?.id ? 'Save Changes' : 'Create Habit'}
            </Button>
            {initialHabit?.id && (
              <div>
                <Button
                  className="absolute left-6 bottom-6"
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete?.(initialHabit)}>
                  Delete Habit
                </Button>
              </div>
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
