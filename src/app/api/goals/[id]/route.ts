import { NextResponse } from 'next/server';
import { requireSession, verifyOwnership } from '@/lib/auth-utils';
import {
  updateGoalById,
  deleteGoalById,
  attachTaskToGoal,
  attachHabitToGoal,
  detachTaskFromGoal,
  detachHabitFromGoal,
} from '@/lib/service';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const verify = await verifyOwnership('goal', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  const { name, description } = await req.json();
  const updated = await updateGoalById(id, {
    name,
    description,
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
  const verify = await verifyOwnership('goal', id, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }
  await deleteGoalById(id);
  return NextResponse.json({ success: true });
}

// Additional endpoints for managing task and habit associations
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: goalId } = await context.params;
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const verify = await verifyOwnership('goal', goalId, userOrResponse.id);
  if (!(typeof verify !== 'object' || 'userId' in verify)) {
    return verify;
  }

  const { action, taskId, habitId } = await req.json();

  switch (action) {
    case 'attachTask':
      if (!taskId)
        return NextResponse.json(
          { error: 'taskId is required' },
          { status: 400 }
        );
      const verifyTask = await verifyOwnership(
        'task',
        taskId,
        userOrResponse.id
      );
      if (!(typeof verifyTask !== 'object' || 'userId' in verifyTask)) {
        return verifyTask;
      }
      const taskResult = await attachTaskToGoal(taskId, goalId);
      return NextResponse.json(taskResult);

    case 'detachTask':
      if (!taskId)
        return NextResponse.json(
          { error: 'taskId is required' },
          { status: 400 }
        );
      const verifyTaskDetach = await verifyOwnership(
        'task',
        taskId,
        userOrResponse.id
      );
      if (
        !(typeof verifyTaskDetach !== 'object' || 'userId' in verifyTaskDetach)
      ) {
        return verifyTaskDetach;
      }
      const taskDetachResult = await detachTaskFromGoal(taskId);
      return NextResponse.json(taskDetachResult);

    case 'attachHabit':
      if (!habitId)
        return NextResponse.json(
          { error: 'habitId is required' },
          { status: 400 }
        );
      const verifyHabit = await verifyOwnership(
        'habit',
        habitId,
        userOrResponse.id
      );
      if (!(typeof verifyHabit !== 'object' || 'userId' in verifyHabit)) {
        return verifyHabit;
      }
      const habitResult = await attachHabitToGoal(habitId, goalId);
      return NextResponse.json(habitResult);

    case 'detachHabit':
      if (!habitId)
        return NextResponse.json(
          { error: 'habitId is required' },
          { status: 400 }
        );
      const verifyHabitDetach = await verifyOwnership(
        'habit',
        habitId,
        userOrResponse.id
      );
      if (
        !(
          typeof verifyHabitDetach !== 'object' || 'userId' in verifyHabitDetach
        )
      ) {
        return verifyHabitDetach;
      }
      const habitDetachResult = await detachHabitFromGoal(habitId);
      return NextResponse.json(habitDetachResult);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
