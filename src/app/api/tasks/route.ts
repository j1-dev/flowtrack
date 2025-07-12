import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { getTasksByUserId, createTask } from '@/lib/service';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const tasks = await getTasksByUserId(userOrResponse.id);
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const { title, start, end, color, description, priority, recurrence } =
    await req.json();
  const task = await createTask(userOrResponse.id, {
    title,
    start: new Date(start),
    end: new Date(end),
    color,
    description,
    priority,
    recurrence,
  });
  return NextResponse.json(task);
}
