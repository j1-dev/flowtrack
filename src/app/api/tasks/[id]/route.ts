import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateTaskById, deleteTaskById } from '@/lib/service';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const verify = await verifyOwnership('task', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  const { title, start, end, color, description, priority, recurrence, goalId } =
    await req.json();
  const updated = await updateTaskById(id, {
    title,
    start: new Date(start),
    end: new Date(end),
    color,
    description,
    priority,
    recurrence,
    goalId,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const verify = await verifyOwnership('task', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  await deleteTaskById(id);
  return NextResponse.json({ success: true });
}
