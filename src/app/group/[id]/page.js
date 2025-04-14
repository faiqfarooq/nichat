"use client";
// src/app/chat/[id]/page.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import Link from "next/link";

export default function ChatDetailPage({ params }) {
  const { data: session, status } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const chatId = params.id;

  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main content */} <div className="w-full h-1 bg-slate-600" />
      <div className="flex-1 flex overflow-hidden">
        {/* Main chat area */}

        <main className="flex-1 bg-dark">
          <ChatWindow chatId={chatId} />
        </main>
      </div>
    </div>
  );
}
