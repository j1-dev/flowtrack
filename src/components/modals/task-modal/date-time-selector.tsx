import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { TimeSelector } from './time-selector';

interface DateTimeSelectorProps {
  label: string;
  date: Date | undefined;
  hour: string;
  minute: string;
  onDateChange: (date: Date | undefined) => void;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  disabled?: boolean;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  label,
  date,
  hour,
  minute,
  onDateChange,
  onHourChange,
  onMinuteChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}>
            {date ? date.toLocaleDateString() : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      <TimeSelector
        hour={hour}
        minute={minute}
        onHourChange={onHourChange}
        onMinuteChange={onMinuteChange}
        disabled={disabled}
      />
    </div>
  );
};
