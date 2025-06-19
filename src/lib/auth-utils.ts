import { auth } from '@/lib/auth';
import { getUserByEmail, getTaskById, getHabitById } from './service';
import { NextResponse } from 'next/server';

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserByEmail(session.user.email);
  if (!user) {
    throw NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return user;
}

export async function verifyOwnership(
  model: 'task' | 'habit',
  id: string,
  userId: string
) {
  const resource =
    model === 'task' ? await getTaskById(id) : await getHabitById(id);

  if (!resource || resource.userId !== userId) {
    throw NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return resource;
}
