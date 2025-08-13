interface DashboardHeaderProps {
  completedToday: number;
  completedHabitsToday: number;
  goalsProgress: number;
  format: (date: string | number | Date, formatStr: string) => string;
}

export function DashboardHeader({
  completedToday,
  completedHabitsToday,
  goalsProgress,
  format,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold">{completedToday}</div>
          <div className="text-muted-foreground">Tasks Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{completedHabitsToday}</div>
          <div className="text-muted-foreground">Habits Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{goalsProgress}%</div>
          <div className="text-muted-foreground">Goals Progress</div>
        </div>
      </div>
    </div>
  );
}
