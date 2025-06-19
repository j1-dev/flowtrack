import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { getHabitsByUserId, createHabit } from '@/lib/service';

export async function GET() {
  try {
    const user = await requireSession();
    const habits = await getHabitsByUserId(user.id);
    return NextResponse.json(habits);
  } catch (e: unknown) {
    console.error('GET /api/habits error:', e);
    const message = e instanceof Error ? e.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSession();
    const { name, frequency, streak } = await req.json();
    const habit = await createHabit(user.id, { name, frequency, streak });
    return NextResponse.json(habit);
  } catch (e: unknown) {
    console.error('POST /api/habits error:', e);
    const message = e instanceof Error ? e.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
