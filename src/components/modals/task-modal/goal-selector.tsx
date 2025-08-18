import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Goal {
  id: string;
  name: string;
}

interface GoalSelectorProps {
  selectedGoalId: string | null;
  goals: Goal[];
  onGoalChange: (goalId: string | null) => void;
  disabled?: boolean;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  selectedGoalId,
  goals,
  onGoalChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">Goal</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}>
            {goals.find((g) => g.id === selectedGoalId)?.name || 'No goal'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[8rem]">
          <DropdownMenuItem onSelect={() => onGoalChange(null)}>
            No goal
          </DropdownMenuItem>
          {goals.map((goal) => (
            <DropdownMenuItem
              key={goal.id}
              onSelect={() => onGoalChange(goal.id)}>
              {goal.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
