import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { getSchedulesByUserId, createSchedule } from '@/lib/service';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const schedules = await getSchedulesByUserId(userOrResponse.id);
  return NextResponse.json(schedules);
}

export async function POST(req: Request) {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const { name, type, taskIds } = await req.json();
  const schedule = await createSchedule(userOrResponse.id, {
    name,
    type,
    taskIds,
  });
  return NextResponse.json(schedule);
}
