import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { updateUserByEmail } from '@/lib/service';

export async function GET() {
  try {
    const user = await requireSession();
    return NextResponse.json(user);
  } catch (e) {
    return e;
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireSession();
    const { name, image } = await req.json();
    const updated = await updateUserByEmail(user.email, { name, image });
    return NextResponse.json(updated);
  } catch (e) {
    return e;
  }
}
