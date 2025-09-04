interface DashboardHeaderProps {
  completedToday: number;
  completedHabitsToday: number;
  goalsProgress: number;
  userName: string;
  format: (date: string | number | Date, formatStr: string) => string;
}

export function DashboardHeader({
  completedToday,
  completedHabitsToday,
  goalsProgress,
  userName,
  format,
}: DashboardHeaderProps) {
  return (
    <div className="md:flex items-center justify-between">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold mb-2">Hi, {userName}</h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      <div className="flex items-center justify-around space-x-6 text-sm pt-4 md:pt-0">
        <div className="text-center">
          <div className="text-2xl font-bold">{completedToday}</div>
          <span className="text-muted-foreground">Tasks Done</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{completedHabitsToday}</div>
          <span className="text-muted-foreground">Habits Done</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{goalsProgress}%</div>
          <span className="text-muted-foreground">Goals Progress</span>
        </div>
      </div>
    </div>
  );
}
