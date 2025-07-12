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
  tags?: Tag[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  recurrence?: string | null;
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
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
  tasks?: Task[];
};
// You can also add types for Account, Session, and VerificationToken if needed
