import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import { updateUserByEmail } from '@/lib/service';

export async function GET() {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  return NextResponse.json(userOrResponse);
}

export async function PUT(req: Request) {
  const userOrResponse = await requireSession();
  if (!(typeof userOrResponse !== 'object' || 'id' in userOrResponse)) {
    return userOrResponse;
  }
  const { name, image } = await req.json();
  const updated = await updateUserByEmail(userOrResponse.email, {
    name,
    image,
  });
  return NextResponse.json(updated);
}
