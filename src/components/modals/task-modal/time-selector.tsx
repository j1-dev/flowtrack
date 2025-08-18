import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TimeSelectorProps {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  disabled?: boolean;
}

const pad = (n: number | string) => n.toString().padStart(2, '0');

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  disabled = false,
}) => {
  return (
    <div className="flex gap-2 mt-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-14 justify-between"
            disabled={disabled}>
            {hour}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-14 p-1 grid grid-cols-2 gap-1">
          {[...Array(24).keys()].map((h) => (
            <DropdownMenuItem key={h} onSelect={() => onHourChange(pad(h))}>
              {pad(h)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="self-center">:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-14 justify-between"
            disabled={disabled}>
            {minute}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-14 p-1 grid grid-cols-2 gap-1">
          {[...Array(12).keys()].map((i) => (
            <DropdownMenuItem
              key={i}
              onSelect={() => onMinuteChange(pad(i * 5))}>
              {pad(i * 5)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
