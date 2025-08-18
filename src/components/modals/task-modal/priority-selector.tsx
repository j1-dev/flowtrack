import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PrioritySelectorProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  onPriorityChange: (priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  disabled?: boolean;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priority,
  onPriorityChange,
  disabled = false,
}) => {
  const getPriorityLabel = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (priority) {
      case 'LOW':
        return 'Low';
      case 'HIGH':
        return 'High';
      default:
        return 'Medium';
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">Priority</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}>
            {getPriorityLabel(priority)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[8rem]">
          <DropdownMenuItem onSelect={() => onPriorityChange('LOW')}>
            Low
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onPriorityChange('MEDIUM')}>
            Medium
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onPriorityChange('HIGH')}>
            High
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
