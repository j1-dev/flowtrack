'use client';

import React, { useEffect, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Goal } from '@/lib/types';

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
  initialGoal?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialGoal,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialGoal) {
      setName(initialGoal.name);
      setDescription(initialGoal.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialGoal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSave({
      id: initialGoal?.id || '',
      name,
      description,
    } as Goal);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialGoal?.id ? 'Edit Goal' : 'Create Goal'}
          </DialogTitle>
          <DialogDescription>
            {initialGoal?.id
              ? 'Make changes to your goal here.'
              : 'Create a new goal to organize your habits and tasks.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter goal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What do you want to achieve with this goal?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            {initialGoal?.id && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete?.(initialGoal)}>
                Delete Goal
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialGoal?.id ? 'Save Changes' : 'Create Goal'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
