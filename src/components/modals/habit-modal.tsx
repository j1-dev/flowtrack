'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Habit } from '@/lib/types';
import { useUserData } from '../data-context';

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
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const { goals } = useUserData();

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialHabit?.id ? 'Edit Habit' : 'Create Habit'}
          </DialogTitle>
          <DialogDescription>
            {initialHabit?.id
              ? 'Make changes to your habit here.'
              : 'Create a new habit to track your progress.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter habit name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(value) =>
                  setFrequency(value as 'DAILY' | 'WEEKLY' | 'MONTHLY')
                }>
                <SelectTrigger>
                  <SelectValue>
                    {frequency === 'DAILY'
                      ? 'Daily'
                      : frequency === 'WEEKLY'
                      ? 'Weekly'
                      : 'Monthly'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="goal">Goal (Optional)</Label>
              <Select
                value={selectedGoalId || 'none'}
                onValueChange={(value) =>
                  setSelectedGoalId(value === 'none' ? null : value)
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal">
                    {goals.find((g) => g.id === selectedGoalId)?.name ||
                      'No goal'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No goal</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {initialHabit?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete?.(initialHabit)}>
                  Delete Habit
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialHabit?.id ? 'Save Changes' : 'Create Habit'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
