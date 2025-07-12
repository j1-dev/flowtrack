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
    recurrence?: string;
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
    recurrence?: string;
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
