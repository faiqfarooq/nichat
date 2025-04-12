"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    messages: 0,
    contacts: 0,
    groups: 0,
    unread: 0,
  });
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (status === "authenticated") {
      // Simulate fetching data
      setTimeout(() => {
        // Mock data for demonstration
        setStats({
          messages: Math.floor(Math.random() * 500) + 100,
          contacts: Math.floor(Math.random() * 50) + 10,
          groups: Math.floor(Math.random() * 10) + 2,
          unread: Math.floor(Math.random() * 20),
        });

        setRecentChats([
          {
            id: "1",
            name: "Sarah Johnson",
            avatar: "https://i.pravatar.cc/150?img=1",
            lastMessage: "Hey, are we still meeting tomorrow?",
            time: "10:30 AM",
            unread: 2,
            online: true,
          },
          {
            id: "2",
            name: "Tech Team",
            avatar: "https://i.pravatar.cc/150?img=2",
            lastMessage: "Michael: I just pushed the new update",
            time: "Yesterday",
            unread: 0,
            isGroup: true,
          },
          {
            id: "3",
            name: "David Wilson",
            avatar: "https://i.pravatar.cc/150?img=3",
            lastMessage: "Thanks for your help!",
            time: "Yesterday",
            unread: 0,
            online: false,
          },
          {
            id: "4",
            name: "Marketing Group",
            avatar: "https://i.pravatar.cc/150?img=4",
            lastMessage: "Jessica: Let's finalize the campaign",
            time: "Monday",
            unread: 5,
            isGroup: true,
          },
        ]);

        setLoading(false);
      }, 1000);
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-dark flex flex-col">
      <main className="flex-1 px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your conversations today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Messages Stat */}
          <div className="bg-dark-lighter rounded-xl p-6 border border-gray-800 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Messages</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.messages}
                </h3>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-400">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span>12% increase</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/chat"
                className="bg-dark-lighter hover:bg-dark-light rounded-xl p-4 border border-gray-800 flex flex-col items-center justify-center text-center transition-colors"
              >
                <div className="bg-primary/20 p-3 rounded-full mb-2">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <span className="text-white font-medium">Messages</span>
              </Link>

              <Link
                href="/groups/new"
                className="bg-dark-lighter hover:bg-dark-light rounded-xl p-4 border border-gray-800 flex flex-col items-center justify-center text-center transition-colors"
              >
                <div className="bg-secondary/20 p-3 rounded-full mb-2">
                  <svg
                    className="w-6 h-6 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-white font-medium">New Group</span>
              </Link>
            </div>
          </div>

          {/* Recent Chats */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Recent Conversations
              </h2>
              <Link
                href="/chat"
                className="text-primary hover:text-primary-light text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="bg-dark-lighter rounded-xl border border-gray-800 overflow-hidden">
              {recentChats.map((chat, index) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={`flex items-center p-4 hover:bg-dark-light transition-colors ${
                    index !== recentChats.length - 1
                      ? "border-b border-gray-800"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                      {chat.avatar ? (
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {chat.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium truncate">
                        {chat.name}
                      </h3>
                      <span className="text-gray-400 text-xs">{chat.time}</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="ml-3 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="text-dark text-xs font-bold">
                        {chat.unread}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
