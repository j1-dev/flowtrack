import { auth } from '@/lib/auth';
import {
  getUserByEmail,
  getTaskById,
  getHabitById,
  getGoalById,
  getNoteById,
} from './service';
import { NextResponse } from 'next/server';

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return user;
}

export async function verifyOwnership(
  model: 'task' | 'habit' | 'goal' | 'note',
  id: string,
  userId: string
) {
  let resource;
  switch (model) {
    case 'task':
      resource = await getTaskById(id);
      break;
    case 'habit':
      resource = await getHabitById(id);
      break;
    case 'goal':
      resource = await getGoalById(id);
      break;
    case 'note':
      resource = await getNoteById(id);
      break;
  }

  if (!resource || resource.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return resource;
}
