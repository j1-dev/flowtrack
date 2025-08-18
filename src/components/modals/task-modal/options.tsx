import React from 'react';
import { PrioritySelector } from './priority-selector';
import { GoalSelector } from './goal-selector';

interface Goal {
  id: string;
  name: string;
}

interface OptionsSectionProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  selectedGoalId: string | null;
  goals: Goal[];
  onPriorityChange: (priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  onGoalChange: (goalId: string | null) => void;
  disabled?: boolean;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({
  priority,
  selectedGoalId,
  goals,
  onPriorityChange,
  onGoalChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PrioritySelector
        priority={priority}
        onPriorityChange={onPriorityChange}
        disabled={disabled}
      />
      <GoalSelector
        selectedGoalId={selectedGoalId}
        goals={goals}
        onGoalChange={onGoalChange}
        disabled={disabled}
      />
    </div>
  );
};
