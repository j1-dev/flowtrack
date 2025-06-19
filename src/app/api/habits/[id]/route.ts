// app/api/habits/[id]/route.ts
import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateHabitById, deleteHabitById } from '@/lib/service';

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
  const { name, frequency, streak } = await request.json();
  const updated = await updateHabitById(id, {
    name,
    frequency,
    streak,
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
  const verify = await verifyOwnership('habit', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  await deleteHabitById(id);
  return NextResponse.json({ success: true });
}
