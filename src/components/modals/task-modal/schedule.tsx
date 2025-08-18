import React from 'react';
import { DateTimeSelector } from './date-time-selector';

interface ScheduleSectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onStartHourChange: (hour: string) => void;
  onStartMinuteChange: (minute: string) => void;
  onEndHourChange: (hour: string) => void;
  onEndMinuteChange: (minute: string) => void;
  disabled?: boolean;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  startDate,
  endDate,
  startHour,
  startMinute,
  endHour,
  endMinute,
  onStartDateChange,
  onEndDateChange,
  onStartHourChange,
  onStartMinuteChange,
  onEndHourChange,
  onEndMinuteChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DateTimeSelector
        label="Start"
        date={startDate}
        hour={startHour}
        minute={startMinute}
        onDateChange={onStartDateChange}
        onHourChange={onStartHourChange}
        onMinuteChange={onStartMinuteChange}
        disabled={disabled}
      />
      <DateTimeSelector
        label="End"
        date={endDate}
        hour={endHour}
        minute={endMinute}
        onDateChange={onEndDateChange}
        onHourChange={onEndHourChange}
        onMinuteChange={onEndMinuteChange}
        disabled={disabled}
      />
    </div>
  );
};
