import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateTaskById, deleteTaskById } from '@/lib/service';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireSession();
    await verifyOwnership('task', params.id, user.id);
    const { title, startTime, endTime, color } = await req.json();
    const updated = await updateTaskById(params.id, {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
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
    await verifyOwnership('task', params.id, user.id);
    await deleteTaskById(params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return e;
  }
}
