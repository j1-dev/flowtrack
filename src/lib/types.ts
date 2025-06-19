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
  startTime: Date;
  endTime: Date;
  color?: string | null;
  userId: string;
  user: User;
};

export type Habit = {
  id: string;
  name: string;
  frequency: string; // e.g. daily, weekly
  streak: number;
  userId: string;
  user: User;
};

// You can also add types for Account, Session, and VerificationToken if needed