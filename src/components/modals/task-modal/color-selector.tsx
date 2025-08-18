import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ColorSelectorProps {
  color: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

const COLOR_OPTIONS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#a21caf', label: 'Purple' },
  { value: '#f59e42', label: 'Orange' },
  { value: '#f43f5e', label: 'Red' },
  { value: '#fbbf24', label: 'Yellow' },
  { value: '#22d3ee', label: 'Cyan' },
  { value: '#64748b', label: 'Slate' },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  color,
  onColorChange,
  disabled = false,
}) => {
  const getColorLabel = (colorValue: string) => {
    const colorOption = COLOR_OPTIONS.find(
      (option) => option.value === colorValue
    );
    return colorOption ? colorOption.label : 'Custom';
  };

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">Color</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}>
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              {getColorLabel(color)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[8rem] grid grid-cols-2 gap-1 p-2">
          {COLOR_OPTIONS.map((colorOption) => (
            <DropdownMenuItem
              key={colorOption.value}
              onSelect={() => onColorChange(colorOption.value)}>
              <span
                className="inline-block w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: colorOption.value }}
              />
              {colorOption.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
