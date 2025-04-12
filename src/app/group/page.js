"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SearchBar from "@/components/search/SearchBar";
import Avatar from "@/components/ui/Avatar";
import { getApiUrl } from "@/lib/apiUtils";

export default function GroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const GROUPS_PER_PAGE = 15;

  const observerTarget = useRef(null);

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch user's groups
  const fetchGroups = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(getApiUrl("/api/group"));

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const data = await response.json();

      // Sort by last update date
      const sortedGroups = data.sort((a, b) => {
        if (!a.updatedAt && !b.updatedAt) return 0;
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      // Implement pagination
      const totalPages = Math.ceil(sortedGroups.length / GROUPS_PER_PAGE);
      setHasMore(pageNum < totalPages);

      // Get groups for current page
      const paginatedGroups = sortedGroups.slice(0, pageNum * GROUPS_PER_PAGE);

      if (append) {
        setGroups((prevGroups) => {
          // Create a map of existing group IDs to avoid duplicates
          const existingGroupIds = new Set(
            prevGroups.map((group) => group._id)
          );
          // Filter out groups that already exist
          const newGroups = paginatedGroups.filter(
            (group) => !existingGroupIds.has(group._id)
          );
          // Return combined array
          return [...prevGroups, ...newGroups];
        });
      } else {
        setGroups(paginatedGroups);
      }

      // Apply search filter if there's a query
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setFilteredGroups(paginatedGroups);
      }
    } catch (error) {
      setError("Error loading groups");
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
      setFilteredGroups(groups);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    // Filter groups by name
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredGroups(filtered);
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

  // Load more groups when page changes
  useEffect(() => {
    if (page > 1) {
      fetchGroups(page, true);
    }
  }, [page]);

  // Initial fetch
  useEffect(() => {
    if (session) {
      fetchGroups(1, false);
    }
  }, [session]);

  // Navigate to group chat
  const navigateToGroup = (groupId) => {
    router.push(`/group/${groupId}`);
  };

  // Loading skeleton
  if (loading && groups.length === 0) {
    return (
      <div className="h-full flex flex-col p-4 bg-dark">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">My Groups</h1>
            <div className="w-24 h-10 bg-dark-light rounded-md animate-pulse"></div>
          </div>
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
          <h1 className="text-2xl font-bold text-white">My Groups</h1>
          <Link
            href="/group/new"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Group
          </Link>
        </div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search groups by name..."
        />
      </div>

      {error && (
        <div className="p-3 text-red-400 text-sm bg-red-400/10 mb-4 rounded-md">
          {error}
          <button
            onClick={() => fetchGroups(1, false)}
            className="ml-2 text-primary text-xs hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-dark-light rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <p className="text-gray-400 mb-2">
              {searchQuery ? "No groups match your search" : "No groups yet"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Try a different search term"
                : "Create a new group to start chatting with multiple people"}
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
            {!searchQuery && (
              <Link
                href="/group/new"
                className="mt-4 px-4 py-2 bg-primary text-dark rounded-md font-medium text-sm hover:bg-primary-dark transition-colors"
              >
                Create Group
              </Link>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {filteredGroups.map((group) => (
                <motion.div
                  key={group._id}
                  className="bg-dark-lighter rounded-lg overflow-hidden cursor-pointer hover:bg-dark-light transition-colors"
                  onClick={() => navigateToGroup(group._id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="p-3 flex items-center">
                    <div className="relative mr-3">
                      <Avatar
                        src={group.groupAvatar}
                        name={group.name}
                        size="md"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-dark-lighter"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-white font-medium truncate">
                          {group.name}
                        </h3>
                        {group.lastMessage && (
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {new Date(
                              group.lastMessage.createdAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-400">
                        <span className="truncate">
                          {group.participants.length} members
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
              {!hasMore && filteredGroups.length > 0 && (
                <div className="py-4 text-center text-gray-500 text-sm">
                  You've reached the end of your groups
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
