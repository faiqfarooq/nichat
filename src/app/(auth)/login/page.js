"use client";

import LoginForm from "@/components/auth/LoginForm";
import useAuthGuard from "@/hooks/useAuthGuard";

export default function LoginPage() {
  // Use auth guard with redirect to dashboard if already authenticated
  useAuthGuard({
    redirectToLoginOnUnauthenticated: false,
    redirectToDashboardOnAuthenticated: true
  });

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}
