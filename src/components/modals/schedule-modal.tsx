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
import { Label } from '@/components/ui/label';
import type { Schedule } from '@/lib/types';

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  initialSchedule?: Schedule | null;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialSchedule,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (initialSchedule) {
      setName(initialSchedule.name);
      setType(initialSchedule.type || '');
    } else {
      setName('');
      setType('');
    }
  }, [initialSchedule, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSave({
      id: initialSchedule?.id || '',
      name,
      type,
    } as Schedule);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialSchedule?.id ? 'Edit Schedule' : 'Create Schedule'}
          </DialogTitle>
          <DialogDescription>
            {initialSchedule?.id
              ? 'Make changes to your schedule here.'
              : 'Create a new schedule to organize your tasks.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter schedule name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {initialSchedule?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete?.(initialSchedule)}>
                  Delete Schedule
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialSchedule?.id ? 'Save Changes' : 'Create Schedule'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
