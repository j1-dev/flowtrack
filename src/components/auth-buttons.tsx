'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export const AuthButtons = () => {
  const { data: session } = useSession();

  return session ? (
    <button onClick={() => signOut()}>Sign out</button>
  ) : (
    <button onClick={() => signIn('google')}>Sign in with Google</button>
  );
};
