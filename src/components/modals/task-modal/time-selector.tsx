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
  minTime?: { hour: string; minute: string };
}

const pad = (n: number | string) => n.toString().padStart(2, '0');

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  disabled = false,
  minTime,
}) => {
  const isHourDisabled = (h: number) => {
    if (!minTime) return false;
    return h < Number(minTime.hour);
  };

  const isMinuteDisabled = (m: number) => {
    if (!minTime) return false;
    // If the selected hour is greater than minimum hour, all minutes are valid
    if (Number(hour) > Number(minTime.hour)) return false;
    // If the selected hour equals minimum hour, check minutes
    if (Number(hour) === Number(minTime.hour)) {
      return m < Number(minTime.minute);
    }
    return false;
  };

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
            <DropdownMenuItem
              key={h}
              onSelect={() => onHourChange(pad(h))}
              disabled={isHourDisabled(h)}
              className={
                isHourDisabled(h) ? 'opacity-50 cursor-not-allowed' : ''
              }>
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
          {[...Array(12).keys()].map((i) => {
            const minuteValue = i * 5;
            return (
              <DropdownMenuItem
                key={i}
                onSelect={() => onMinuteChange(pad(minuteValue))}
                disabled={isMinuteDisabled(minuteValue)}
                className={
                  isMinuteDisabled(minuteValue)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }>
                {pad(minuteValue)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
