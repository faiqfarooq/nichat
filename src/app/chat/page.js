"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the chat page in the chat-layout folder
    router.replace("/chat");
  }, [router]);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-400">Redirecting to chat...</p>
    </div>
  );
}
