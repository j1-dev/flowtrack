import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateNoteById, deleteNoteById } from '@/lib/service';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const verify = await verifyOwnership('habit', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  const { title, content, taskId, habitId, goalId } = await request.json();
  const updated = await updateNoteById(id, {
    title,
    content,
    taskId,
    habitId,
    goalId,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const verify = await verifyOwnership('note', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  await deleteNoteById(id);
  return NextResponse.json({ success: true });
}
