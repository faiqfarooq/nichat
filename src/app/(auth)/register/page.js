'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const { status } = useSession();
  
  const router = useRouter();
  
  // Redirect to chat if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      
      <main className="flex-1 flex items-center justify-center p-4">
        <RegisterForm />
      </main>
      
    </div>
  );
}
