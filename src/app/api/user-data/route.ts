import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth-utils';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }

  try {
    const [user, tasks, habits, goals] = await Promise.all([
      prisma.user.findUnique({ where: { id: userOrResponse.id } }),
      prisma.task.findMany({ where: { userId: userOrResponse.id } }),
      prisma.habit.findMany({ where: { userId: userOrResponse.id } }),
      prisma.goal.findMany({
        where: { userId: userOrResponse.id },
        orderBy: { name: 'asc' },
        include: {
          tasks: true,
          habits: true,
        },
      }),
    ]);

    return NextResponse.json({ user, tasks, habits, goals });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
