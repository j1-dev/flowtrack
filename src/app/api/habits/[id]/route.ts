// app/api/habits/[id]/route.ts
import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import { updateHabitById, deleteHabitById } from '@/lib/service';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const user = await requireSession();
    await verifyOwnership('habit', id, user.id);
    const { name, frequency, streak } = await request.json();
    const updated = await updateHabitById(id, { name, frequency, streak });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const user = await requireSession();
    await verifyOwnership('habit', id, user.id);
    await deleteHabitById(id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
}
