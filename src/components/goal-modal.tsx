'use client';

import React, { useEffect, useState } from 'react';
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialGoal?.id ? 'Edit Goal' : 'Create Goal'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Name</Label>
            <Input
              type="text"
              placeholder="Goal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-background border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Description</Label>
            <Textarea
              placeholder="Describe the goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-background border resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {initialGoal?.id ? 'Save Changes' : 'Create Goal'}
            </Button>
            {initialGoal?.id && (
              <Button
                className="absolute left-6 bottom-6"
                type="button"
                variant="destructive"
                onClick={() => onDelete?.(initialGoal)}>
                Delete goal
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
