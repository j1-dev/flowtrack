import { Habit } from '@/lib/types';

type HabitOccurrence = {
  habit: Habit;
  nextDate: Date;
};

type HabitIndicatorProps = {
  habits: Habit[];
  hour: Date;
  maxOccurrences?: number;
};

const HabitIndicator = ({
  habits,
  hour,
  maxOccurrences = 3,
}: HabitIndicatorProps) => {
  const getNextOccurrences = (habit: Habit): HabitOccurrence[] => {
    if (habit.completedAt === habit.createdAt) return [];

    const occurrences: HabitOccurrence[] = [];
    const completedAt = new Date(habit.completedAt);
    let nextDate = new Date(completedAt);

    for (let i = 0; i < maxOccurrences; i++) {
      switch (habit.frequency) {
        case 'DAYS':
          nextDate = new Date(nextDate);
          nextDate.setDate(nextDate.getDate() + (habit.amount || 1));
          break;
        case 'WEEKS':
          nextDate = new Date(nextDate);
          nextDate.setDate(nextDate.getDate() + 7 * (habit.amount || 1));
          break;
        case 'MONTHS':
          nextDate = new Date(nextDate);
          nextDate.setMonth(nextDate.getMonth() + (habit.amount || 1));
          break;
        default:
          continue;
      }
      occurrences.push({ habit, nextDate: new Date(nextDate) });
    }
    return occurrences;
  };

  const hourStart = new Date(hour);
  hourStart.setMinutes(0, 0, 0);
  const hourEnd = new Date(hourStart);
  hourEnd.setHours(hourEnd.getHours() + 1);

  const availableHabits = habits
    .flatMap(getNextOccurrences)
    .filter(({ nextDate }) => nextDate >= hourStart && nextDate < hourEnd);

  if (availableHabits.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 pointer-events-none">
      {availableHabits.map(({ habit, nextDate }) => {
        const color =
          habit.frequency === 'DAYS'
            ? 'bg-green-500'
            : habit.frequency === 'WEEKS'
            ? 'bg-blue-500'
            : 'bg-purple-500';

        const timeStr = nextDate.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        return (
          <div
            key={`${habit.id}-${nextDate.getTime()}`}
            className="flex items-center gap-2 px-2 py-1"
            title={`${habit.name} becomes available at ${timeStr}`}>
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-xs text-muted-foreground truncate">
              {habit.name} ({timeStr})
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HabitIndicator;
