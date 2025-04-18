'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const { status } = useSession();
  const router = useRouter();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      console.log("User is already authenticated, redirecting from forgot-password page");
      
      // Use window.location for a hard redirect
      window.location.href = '/dashboard';
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
