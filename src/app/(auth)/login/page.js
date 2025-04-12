"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { status } = useSession();

  const router = useRouter();

  // Redirect to chat if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <header className="py-4 px-6 border-b border-gray-800">
        <Link href="/" className="flex items-center">
          <img
            src="/assets/images/logo.png"
            alt="Chat App"
            className="w-8 h-8 object-contain mr-2"
          />
          <h1 className="text-white font-semibold text-xl">Chat App</h1>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>

      <footer className="py-4 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Chat App. All rights reserved.
      </footer>
    </div>
  );
}
