'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard = ({ goal, onEdit, onDelete }: GoalCardProps) => {
  return (
    <Card className="group transition-all ">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="truncate">{goal.name}</CardTitle>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(goal)}
            className="h-8 w-8 p-0">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(goal.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {goal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </p>
        )}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>{goal?.tasks?.length ?? 0} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <span>{goal?.habits?.length ?? 0} habits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
