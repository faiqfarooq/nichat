'use client';

import { SessionProvider } from 'next-auth/react';

// Wrapper for NextAuth's SessionProvider
const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;