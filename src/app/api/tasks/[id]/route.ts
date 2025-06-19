import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateTaskById, deleteTaskById } from '@/lib/service';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const user = await requireSession();
    await verifyOwnership('task', id, user.id);
    const { title, startTime, endTime, color } = await req.json();
    const updated = await updateTaskById(id, {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const user = await requireSession();
    await verifyOwnership('task', id, user.id);
    await deleteTaskById(id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
}
