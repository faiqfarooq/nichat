"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import ChatItem from "./ChatItem";
import { useSocket } from "@/hooks/useSocket";
import SearchBar from "../search/SearcgBar";
import { getApiUrl } from "@/lib/apiUtils";

const ChatList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { socket } = useSocket();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' or 'groups'

  // Get current active chat ID from URL
  const activeChatId = pathname.startsWith("/chat/")
    ? pathname.split("/chat/")[1]
    : null;

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl("/api/chats"));

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();

      // Sort by last message date
      const sortedChats = data.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return (
          new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
      });

      setChats(sortedChats);
    } catch (error) {
      setError("Error loading chats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        getApiUrl(`/api/users/search?query=${encodeURIComponent(query)}`)
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Create or open chat with user
  const startChat = async (userId) => {
    try {
      // Create or get existing chat
      const response = await fetch(getApiUrl("/api/chats"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const chat = await response.json();

      // Refresh chats list
      fetchChats();

      // Navigate to the new chat
      router.push(`/chat/${chat._id}`);

      // Reset search
      setIsSearching(false);
      setSearchResults([]);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  // Filter chats based on active tab
  const filteredChats = chats.filter((chat) => {
    if (activeTab === "groups") return chat.isGroup;
    return !chat.isGroup;
  });

  // Initial fetch
  useEffect(() => {
    if (session) {
      fetchChats();
    }
  }, [session]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("newMessage", (message) => {
      // Update unread count and last message
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === message.chat) {
            // Don't increment unread if this is the active chat
            const shouldIncrementUnread =
              activeChatId !== message.chat &&
              message.sender !== session?.user.id;

            // Handle both Map objects and plain objects from API
            let currentUnreadCount = 0;
            if (chat.unreadCount) {
              if (typeof chat.unreadCount.get === "function") {
                currentUnreadCount =
                  chat.unreadCount.get(session?.user.id) || 0;
              } else {
                currentUnreadCount = chat.unreadCount[session?.user.id] || 0;
              }
            }

            return {
              ...chat,
              lastMessage: message,
              unreadCount: shouldIncrementUnread
                ? currentUnreadCount + 1
                : currentUnreadCount,
            };
          }
          return chat;
        });
      });
    });

    // Listen for new chats
    socket.on("newChat", (chat) => {
      setChats((prevChats) => {
        // Check if chat already exists
        const exists = prevChats.some((c) => c._id === chat._id);
        if (exists) return prevChats;

        return [chat, ...prevChats];
      });
    });

    // Clean up listeners
    return () => {
      socket.off("newMessage");
      socket.off("newChat");
    };
  }, [socket, activeChatId, session]);

  // Loading skeleton
  if (loading && chats.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <div className="bg-dark-light h-10 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-3 mb-1">
              <div className="w-12 h-12 rounded-full bg-dark-light animate-pulse"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-dark-light rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-dark-light rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-700 sticky top-0 bg-dark-lighter z-10">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users and chats..."
        />
      </div>

      {error && (
        <div className="p-3 text-red-400 text-sm bg-red-400/10 m-3 rounded-md">
          {error}
          <button
            onClick={fetchChats}
            className="ml-2 text-primary text-xs hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {isSearching ? (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 flex items-center justify-between text-sm">
            <h3 className="font-medium text-gray-400">Search Results</h3>
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchResults([]);
              }}
              className="text-primary text-xs hover:underline"
            >
              Cancel
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="w-16 h-16 bg-dark-light rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <p className="text-gray-400 mb-1">No users found</p>
              <p className="text-gray-500 text-sm">
                Try a different search term
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {searchResults.map((user) => (
                  <motion.li
                    key={user._id}
                    onClick={() => startChat(user._id)}
                    className="flex items-center px-4 py-3 hover:bg-dark-light cursor-pointer transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(42, 57, 66, 0.8)" }}
                  >
                    <div className="relative">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=34B7F1&color=fff`
                        }
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-700"
                      />
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium truncate">
                          {user.name}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {user.isOnline ? (
                            <span className="text-green-400">Online</span>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>

                      <div className="flex items-center mt-1">
                        <p className="text-gray-400 text-sm truncate max-w-[200px]">
                          {user.status || "Hey there! I am using Chat App"}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 px-1">
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 py-3 text-sm font-medium relative ${
                activeTab === "chats"
                  ? "text-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Chats
              {activeTab === "chats" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-3 text-sm font-medium relative ${
                activeTab === "groups"
                  ? "text-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Groups
              {activeTab === "groups" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>

          {filteredChats.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-4 py-8 text-center">
              <div>
                <div className="w-16 h-16 bg-dark-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {activeTab === "chats" ? (
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    ) : (
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    )}
                  </svg>
                </div>
                <p className="text-gray-400 mb-1">
                  {activeTab === "chats" ? "No chats yet" : "No groups yet"}
                </p>
                <p className="text-gray-500 text-sm">
                  {activeTab === "chats"
                    ? "Search for users to start chatting"
                    : "Create a group to chat with multiple people"}
                </p>
                <button
                  onClick={() => {
                    if (activeTab === "groups") {
                      router.push("/group/new");
                    } else {
                      router.push("/search");
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-dark rounded-md font-medium text-sm hover:bg-primary-dark transition-colors"
                >
                  {activeTab === "chats" ? "Find Friends" : "Create Group"}
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-gray-700/50"
              >
                {filteredChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    active={chat._id === activeChatId}
                    currentUserId={session?.user.id}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Create new chat/group button */}
      <div className="p-3 border-t border-gray-700 bg-dark-lighter">
        <button
          onClick={() => {
            if (activeTab === "groups") {
              // Navigate to create group page
              router.push("/group/new");
            } else {
              setIsSearching(true);
            }
          }}
          className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-dark font-semibold rounded-lg transition flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {activeTab === "groups" ? "Create Group" : "New Chat"}
        </button>
      </div>
    </div>
  );
};

export default ChatList;
