// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isPublicPath } from '@/app/api/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware triggered for:', pathname);

  // 0) Allow NextAuth’s own API routes (OAuth callbacks, etc.)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 1) Skip static, _next, public files, and any explicitly public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/) ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  // 2) Grab the NextAuth token (session)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isApiRoute = pathname.startsWith('/api');
  const isHomeRoute = pathname === '/';

  // 2a) If a signed‑in user hits '/', send them to dashboard
  if (token && isHomeRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 3) Protect real API routes
  if (isApiRoute) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 4) Redirect signed‑in users away from login/signup
  if (token && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 5) Redirect unauthenticated users from protected pages to login
  if (!token && !isAuthRoute && !isHomeRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // 6) Otherwise continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
