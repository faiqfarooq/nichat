"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthGuard from "@/hooks/useAuthGuard";
import { motion, AnimatePresence } from "framer-motion";
import ChatItem from "@/components/chat/ChatItem";
import SearchBar from "@/components/search/SearchBar";
import { getApiUrl } from "@/lib/apiUtils";

export default function ChatPage() {
  const { session } = useAuthGuard();
  const router = useRouter();

  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const CHATS_PER_PAGE = 15;

  const observerTarget = useRef(null);

  // Authentication is handled by useAuthGuard

  // Fetch user's chats
  const fetchChats = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(getApiUrl("/api/chats"));

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      
      // Filter out group chats
      const nonGroupChats = data.filter(chat => !chat.isGroup);

      // Sort by last message date
      const sortedChats = nonGroupChats.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return (
          new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
      });

      // Implement pagination
      const totalPages = Math.ceil(sortedChats.length / CHATS_PER_PAGE);
      setHasMore(pageNum < totalPages);

      // Get chats for current page
      const paginatedChats = sortedChats.slice(0, pageNum * CHATS_PER_PAGE);

      if (append) {
        setChats((prevChats) => {
          // Create a map of existing chat IDs to avoid duplicates
          const existingChatIds = new Set(prevChats.map((chat) => chat._id));
          // Filter out chats that already exist
          const newChats = paginatedChats.filter(
            (chat) => !existingChatIds.has(chat._id)
          );
          // Return combined array
          return [...prevChats, ...newChats];
        });
      } else {
        setChats(paginatedChats);
      }

      // Apply search filter if there's a query
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setFilteredChats(paginatedChats);
      }
    } catch (error) {
      setError("Error loading chats");
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredChats(chats);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    // Filter chats by name (only for 1-on-1 chats)
    const filtered = chats.filter((chat) => {
      // For 1-on-1 chats, search by other user's name
      const otherUser = chat.participants.find(
        (participant) => participant._id !== session?.user.id
      );
      return otherUser?.name?.toLowerCase().includes(lowerCaseQuery);
    });

    setFilteredChats(filtered);
  };

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!observerTarget.current || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, loading, loadingMore, hasMore]);

  // Load more chats when page changes
  useEffect(() => {
    if (page > 1) {
      fetchChats(page, true);
    }
  }, [page]);

  // Initial fetch
  useEffect(() => {
    if (session) {
      fetchChats(1, false);
    }
  }, [session]);

  // Loading skeleton
  if (loading && chats.length === 0) {
    return (
      <div className="h-full flex flex-col p-4 bg-dark">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">My Chats</h1>
          <div className="bg-dark-light h-10 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center p-3 mb-3 bg-dark-lighter rounded-lg"
            >
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
    <div className="h-full flex flex-col p-4 bg-dark">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">My Chats</h1>
          <button
            onClick={() => router.push("/search")}
            className="px-4 py-2 bg-primary text-dark rounded-md font-medium text-sm hover:bg-primary-dark transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Users
          </button>
        </div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search chats by name..."
        />
      </div>

      {error && (
        <div className="p-3 text-red-400 text-sm bg-red-400/10 mb-4 rounded-md">
          {error}
          <button
            onClick={() => fetchChats(1, false)}
            className="ml-2 text-primary text-xs hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-dark-light rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-400 mb-2">
              {searchQuery ? "No chats match your search" : "No chats yet"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation to see it here"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleSearch("");
                }}
                className="mt-4 px-4 py-2 bg-primary text-dark rounded-md font-medium text-sm hover:bg-primary-dark transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  className="bg-dark-lighter rounded-lg overflow-hidden"
                >
                  <ChatItem
                    chat={chat}
                    active={false}
                    currentUserId={session?.user.id}
                  />
                </div>
              ))}

              {/* Loading more indicator */}
              {loadingMore && (
                <div className="py-4 flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Intersection observer target */}
              {hasMore && !loadingMore && (
                <div ref={observerTarget} className="h-4"></div>
              )}

              {/* End of list message */}
              {!hasMore && filteredChats.length > 0 && (
                <div className="py-4 text-center text-gray-500 text-sm">
                  You've reached the end of your chats
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
