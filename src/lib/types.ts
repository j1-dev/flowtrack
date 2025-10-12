// Generate TypeScript types from Prisma schema

export type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  createdAt: Date;

  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  notes: Note[];
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  start: Date;
  end: Date;
  color?: string | null;
  userId: string;
  user: User;
  completed: boolean;
  goalId?: string | null;
  goal?: Goal | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
};

export type Habit = {
  id: string;
  name: string;
  frequency: 'DAYS' | 'WEEKS' | 'MONTHS';
  amount: number;
  streak: number;
  userId: string;
  user: User;
  goalId?: string | null;
  goal?: Goal | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;

  notes: Note[];
};

export type Goal = {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  user: User;
  tasks: Task[];
  habits: Habit[];
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
};

export type Note = {
  id: string;
  content: string;
  userId: string;
  user: User;
  taskId?: string | null;
  task?: Task | null;
  habitId?: string | null;
  habit?: Habit | null;
  goalId?: string | null;
  goal?: Goal | null;
  createdAt: Date;
  updatedAt: Date;
};

