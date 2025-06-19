import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateHabitById, deleteHabitById } from '@/lib/service';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireSession();
    await verifyOwnership('habit', params.id, user.id);
    const { name, frequency, streak } = await req.json();
    const updated = await updateHabitById(params.id, {
      name,
      frequency,
      streak,
    });
    return NextResponse.json(updated);
  } catch (e) {
    return e;
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireSession();
    await verifyOwnership('habit', params.id, user.id);
    await deleteHabitById(params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return e;
  }
}