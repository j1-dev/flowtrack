'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { FC } from 'react';

export interface AuthButtonsProps {
  primary?: boolean;
  big?: boolean;
  className?: string;
}

export const AuthButtons: FC<AuthButtonsProps> = ({
  primary = false,
  big = false,
  className = '',
}) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const baseClasses =
    'rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = primary
    ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary'
    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary';
  const sizeClasses = big ? 'h-10 px-6 text-lg' : 'px-4 py-2 text-base';

  if (loading) {
    return (
      <button
        disabled
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} opacity-50 cursor-wait`}>
        Loading...
      </button>
    );
  }

  return session ? (
    <button
      onClick={() => signOut()}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      Sign Out
    </button>
  ) : (
    <button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {primary ? 'Get Started' : 'Sign in with Google'}
    </button>
  );
};
