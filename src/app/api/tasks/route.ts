// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { getTasksByUserId, createTask } from '@/lib/service';

export async function GET() {
  try {
    const user = await requireSession();
    const tasks = await getTasksByUserId(user.id);
    return NextResponse.json(tasks);
  } catch (e) {
    return e;
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSession();
    const { title, startTime, endTime, color } = await req.json();
    const task = await createTask(user.id, {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
    });
    return NextResponse.json(task);
  } catch (e) {
    return e;
  }
}