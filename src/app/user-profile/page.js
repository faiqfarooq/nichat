"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { useSearchParams } from "next/navigation";
import { getApiUrl } from "@/lib/apiUtils";

export default function UserProfilePage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  // Check if user is authenticated
  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(getApiUrl(`/api/users/${userId}`));

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Could not load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // Handle follow/unfollow user
  const handleFollowAction = async (action) => {
    if (!userProfile) return;

    try {
      const response = await fetch(getApiUrl(`/api/users/${userProfile._id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action, // 'follow' or 'unfollow'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      // Update local state to reflect the change
      setUserProfile((prev) => ({
        ...prev,
        isFollowing: action === "follow",
      }));
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  // Handle block user
  const handleBlockUser = async () => {
    if (!userProfile) return;

    try {
      const response = await fetch(getApiUrl(`/api/users/${userProfile._id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "block",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to block user");
      }

      // Redirect to dashboard after blocking
      router.push("/dashboard");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  // Start a chat with this user
  const startChat = async () => {
    if (!userProfile) return;

    try {
      // Create or get existing chat
      const response = await fetch(getApiUrl("/api/chats"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userProfile._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const chat = await response.json();

      // Navigate to the chat
      router.push(`/chat/${chat._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="bg-dark-lighter p-6 rounded-lg border border-gray-700 max-w-md w-full">
          <div className="text-red-400 mb-4">{error || "User not found"}</div>
          <Link
            href="/dashboard"
            className="block w-full py-2 bg-primary text-dark text-center rounded-lg font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 bg-dark-lighter rounded-full text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 pt-16">
        {/* Profile Card */}
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50 relative">
          {/* Cover Photo/Banner */}
          <div className="h-40 bg-gradient-to-r from-primary/40 via-purple-500/30 to-secondary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-lighter/80"></div>
          </div>

          {/* Avatar section */}
          <div className="px-6 pb-6 flex flex-col items-center">
            <div className="relative -mt-20 mb-4">
              <div className="border-4 border-dark-lighter shadow-lg shadow-primary/20 rounded-full">
                <Avatar
                  src={userProfile.avatar}
                  name={userProfile.name}
                  size="3xl"
                />
              </div>
              {userProfile.isOnline && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
              )}
            </div>

            <h2 className="text-3xl font-bold text-white mb-1 mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {userProfile.name}
            </h2>

            <div className="flex items-center mt-2 space-x-2">
              {userProfile.isOnline && (
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </div>
              )}

              {userProfile.isPrivate && (
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                  Private Account
                </div>
              )}
            </div>

            {userProfile.status && (
              <div className="mt-3 text-gray-300 text-center max-w-md">
                <svg
                  className="w-4 h-4 inline-block mr-1 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
                </svg>
                "{userProfile.status}"
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <button
                onClick={startChat}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-dark font-medium rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Message
              </button>

              {userProfile.isFollowing ? (
                <button
                  onClick={() => handleFollowAction("unfollow")}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="17" y1="8" x2="23" y2="8"></line>
                    <line x1="20" y1="5" x2="20" y2="11"></line>
                  </svg>
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollowAction("follow")}
                  className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-dark font-medium rounded-lg transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Follow
                </button>
              )}

              <button
                onClick={handleBlockUser}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
                Block
              </button>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-3 divide-x divide-gray-700 border-t border-b border-gray-700 mt-4 bg-dark-lighter/50">
            <div className="p-4 text-center hover:bg-dark-lighter/80 transition-colors">
              <p className="text-2xl font-bold text-white">
                {userProfile.followers?.length || 0}
              </p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="p-4 text-center hover:bg-dark-lighter/80 transition-colors">
              <p className="text-2xl font-bold text-white">
                {userProfile.following?.length || 0}
              </p>
              <p className="text-sm text-gray-400">Following</p>
            </div>
            <div className="p-4 text-center hover:bg-dark-lighter/80 transition-colors">
              <p className="text-2xl font-bold text-white">
                {userProfile.lastSeen
                  ? new Date(userProfile.lastSeen).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-400">Last Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
