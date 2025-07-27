import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { getGoalsByUserId, createGoal } from '@/lib/service';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const goals = await getGoalsByUserId(userOrResponse.id);
  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const { name, description } = await req.json();
  const goal = await createGoal(userOrResponse.id, {
    name,
    description,
  });
  return NextResponse.json(goal);
}
