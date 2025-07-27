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
};

export type Habit = {
  id: string;
  name: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  streak: number;
  userId: string;
  user: User;
  goalId?: string | null;
  goal?: Goal | null;
  createdAt: Date;
  updatedAt: Date;
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
};
// You can also add types for Account, Session, and VerificationToken if needed
