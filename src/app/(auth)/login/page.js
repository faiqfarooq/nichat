"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { status } = useSession();

  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      // Get the intended destination from URL or default to dashboard
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
      
      // If the callbackUrl is to the login page or contains a callbackUrl parameter itself, use dashboard
      if (!callbackUrl || callbackUrl.includes('/login') || callbackUrl.includes('callbackUrl')) {
        router.push("/dashboard");
      } else {
        router.push(callbackUrl);
      }
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}
