import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { getHabitsByUserId, createHabit } from '@/lib/service';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const habits = await getHabitsByUserId(userOrResponse.id);
  return NextResponse.json(habits);
}

export async function POST(req: Request) {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const { name, frequency, streak, goalId } = await req.json();
  const habit = await createHabit(userOrResponse.id, {
    name,
    frequency,
    streak,
    goalId,
  });
  return NextResponse.json(habit);
}
