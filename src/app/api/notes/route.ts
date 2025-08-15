import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { createNote, getNotesByUserId } from '@/lib/service';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const notes = await getNotesByUserId(userOrResponse.id);
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const { title, content, taskId, habitId, goalId } = await req.json();
  const note = await createNote(userOrResponse.id, {
    title,
    content,
    taskId,
    habitId,
    goalId,
  });
  return NextResponse.json(note);
}
