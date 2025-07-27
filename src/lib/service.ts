// lib/service.ts
import { prisma } from './prisma';

/** ===========================
 *            USER
 *  =========================== */

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateUserByEmail(
  email: string,
  data: { name?: string; image?: string }
) {
  return prisma.user.update({
    where: { email },
    data,
  });
}

/** ===========================
 *            TASKS
 *  =========================== */

export async function getTasksByUserId(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { start: 'asc' },
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    start: Date;
    end: Date;
    color?: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    goalId?: string | null;
  }
) {
  return prisma.task.create({
    data: { ...data, userId },
  });
}

export async function updateTaskById(
  id: string,
  data: {
    title?: string;
    start?: Date;
    end?: Date;
    color?: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    goalId?: string | null;
    completed?: boolean;
  }
) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTaskById(id: string) {
  return prisma.task.delete({ where: { id } });
}

/** ===========================
 *            HABITS
 *  =========================== */

export async function getHabitsByUserId(userId: string) {
  return prisma.habit.findMany({ where: { userId }, orderBy: { name: 'asc' } });
}

export async function getHabitById(id: string) {
  return prisma.habit.findUnique({ where: { id } });
}

import type { Frequency } from '@prisma/client';

export async function createHabit(
  userId: string,
  data: { name: string; frequency: Frequency; streak?: number }
) {
  return prisma.habit.create({
    data: { ...data, userId },
  });
}

export async function updateHabitById(
  id: string,
  data: { name?: string; frequency?: Frequency; streak?: number }
) {
  return prisma.habit.update({
    where: { id },
    data,
  });
}

export async function deleteHabitById(id: string) {
  return prisma.habit.delete({ where: { id } });
}

/** ===========================
 *            GOALS
 *  =========================== */

export async function getGoalsByUserId(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    include: {
      tasks: true,
      habits: true,
    },
  });
}

export async function getGoalById(id: string) {
  return prisma.goal.findUnique({
    where: { id },
    include: {
      tasks: true,
      habits: true,
    },
  });
}

export async function createGoal(
  userId: string,
  data: {
    name: string;
    description?: string;
  }
) {
  return prisma.goal.create({
    data: { ...data, userId },
  });
}

export async function updateGoalById(
  id: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  return prisma.goal.update({
    where: { id },
    data,
  });
}

export async function deleteGoalById(id: string) {
  return prisma.goal.delete({ where: { id } });
}

// Helper functions to associate/dissociate tasks and habits with goals
export async function attachTaskToGoal(taskId: string, goalId: string) {
  return prisma.task.update({
    where: { id: taskId },
    data: { goalId },
  });
}

export async function detachTaskFromGoal(taskId: string) {
  return prisma.task.update({
    where: { id: taskId },
    data: { goalId: null },
  });
}

export async function attachHabitToGoal(habitId: string, goalId: string) {
  return prisma.habit.update({
    where: { id: habitId },
    data: { goalId },
  });
}

export async function detachHabitFromGoal(habitId: string) {
  return prisma.habit.update({
    where: { id: habitId },
    data: { goalId: null },
  });
}
