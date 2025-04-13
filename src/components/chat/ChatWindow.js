"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatRelative } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";
import MessageInput from "./MessageInput";
import CallModal from "@/components/call/CallModal";
import { useSocket } from "@/hooks/useSocket";
import { useCall } from "@/hooks/useCall";
import { getApiUrl } from "@/lib/apiUtils";
import Avatar from "../ui/Avatar";

const ChatWindow = ({ chatId }) => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { startCall, CallModal, isCallActive } = useCall();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [typing, setTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatBackgroundColor, setChatBackgroundColor] = useState("#121212");

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // Fetch chat details
  const fetchChat = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/chats/${chatId}`));

      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }

      const data = await response.json();
      setChat(data);
    } catch (error) {
      console.error("Error loading chat:", error);
      setError("Could not load chat details");
    }
  };

  // Fetch messages
  const fetchMessages = async (before = null) => {
    try {
      if (!before) setLoading(true);
      else setLoadingMore(true);

      let url = getApiUrl(`/api/messages?chatId=${chatId}`);
      if (before) url += `&before=${before}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      }

      if (before) {
        setMessages((prev) => [...data, ...prev]);
      } else {
        setMessages(data);
        // Scroll to bottom on initial load
        setTimeout(() => {
          scrollToBottom();
          setInitialLoad(false);
        }, 300);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Could not load messages");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more messages when scrolling to top
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (container.scrollTop < 50 && !loadingMore && hasMore) {
      const oldestMessage = messages[0];
      if (oldestMessage) {
        fetchMessages(oldestMessage._id);
      }
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send a message
  const sendMessage = async (
    content,
    contentType = "text",
    replyToId = null,
    fileData = null
  ) => {
    try {
      // Reset typing indicator
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Notify other users that typing has stopped
      if (socket) {
        socket.emit("typing:stop", { chatId });
      }

      // Clear reply to
      const actualReplyTo = replyToId || (replyTo ? replyTo._id : null);
      setReplyTo(null);

      // Extract file data if provided
      const fileUrl = fileData?.fileUrl || null;
      const fileName = fileData?.fileName || null;
      const fileSize = fileData?.fileSize || null;

      // Send message via socket if available
      if (socket && socket.connected) {
        socket.emit("message:new", {
          chatId,
          content,
          contentType,
          replyTo: actualReplyTo,
          fileUrl,
          fileName,
          fileSize,
        });

        // Focus the input field again
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }

        return;
      }

      // Fallback to API if socket is not available
      const response = await fetch(getApiUrl("/api/messages"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          content,
          contentType,
          replyTo: actualReplyTo,
          fileUrl,
          fileName,
          fileSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage = await response.json();

      // Add message to state with animation
      setMessages((prev) => [...prev, { ...newMessage, animate: true }]);

      // Scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Focus the input field again
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!typing) {
      setTyping(true);

      // Emit typing event
      if (socket) {
        socket.emit("typing:start", { chatId });
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);

      // Emit stop typing event
      if (socket) {
        socket.emit("typing:stop", { chatId });
      }
    }, 3000);
  };

  // Handle reply to message
  const handleReplyTo = (message) => {
    setReplyTo(message);

    // Focus the input field
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // Cancel reply
  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // Handle starting a call
  const handleStartCall = (type) => {
    console.log(`handleStartCall called with type: ${type}`);

    if (!chat || chat.isGroup) {
      console.log("Cannot start call: chat is null or is a group chat");
      return;
    }

    // Get the other user in the chat
    const otherUser = chat.participants.find(
      (participant) => participant._id !== session?.user?.id
    );

    if (!otherUser) {
      console.log("Cannot start call: other user not found in participants");
      return;
    }

    console.log("Starting call to user:", otherUser);

    // Start the call using our new useCall hook
    startCall(
      otherUser._id,
      otherUser.name || "User",
      otherUser.avatar || "",
      type
    );
  };

  // Fetch user preferences
  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(getApiUrl('/api/users/preferences'));
      
      if (response.ok) {
        const data = await response.json();
        if (data.preferences?.chatBackgroundColor) {
          setChatBackgroundColor(data.preferences.chatBackgroundColor);
        }
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  // Initialize chat, messages, and preferences
  useEffect(() => {
    if (chatId && session) {
      setInitialLoad(true);
      fetchChat();
      fetchMessages();
      fetchUserPreferences();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, session]);

  // Handle message editing
  const handleEditMessage = (messageId, newContent) => {
    if (!socket || !messageId || !newContent.trim()) return;

    socket.emit("message:edit", {
      messageId,
      content: newContent,
    });
  };

  // Handle message deletion
  const handleDeleteMessage = (messageId, deleteForEveryone = false) => {
    if (!socket || !messageId) return;

    socket.emit("message:delete", {
      messageId,
      deleteForEveryone,
    });
  };

  // Handle view profile
  const handleViewProfile = () => {
    if (!chat) return;

    const otherUser = chat.participants.find(
      (participant) => participant._id !== session?.user?.id
    );

    if (otherUser) {
      setSelectedUser(otherUser);
      setShowUserProfileModal(true);
    }
  };

  // Handle block user
  const handleBlockUser = async () => {
    if (!chat || isProcessing) return;

    const otherUser = chat.participants.find(
      (participant) => participant._id !== session?.user?.id
    );

    if (!otherUser) return;

    try {
      setIsProcessing(true);

      const response = await fetch(getApiUrl(`/api/users/${otherUser._id}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "block",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to block user");
      }

      // Redirect to dashboard after blocking
      router.push("/dashboard");
    } catch (error) {
      console.error("Error blocking user:", error);
      alert(error.message || "Failed to block user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle unfollow user
  const handleUnfollowUser = async () => {
    if (!chat || isProcessing) return;

    const otherUser = chat.participants.find(
      (participant) => participant._id !== session?.user?.id
    );

    if (!otherUser) return;

    try {
      setIsProcessing(true);

      const response = await fetch(getApiUrl(`/api/users/${otherUser._id}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "removeContact",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unfollow user");
      }

      // Show success message
      alert("User unfollowed successfully");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      alert(error.message || "Failed to unfollow user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle leave group
  const handleLeaveGroup = async () => {
    if (!chat || !chat.isGroup || isProcessing) return;

    try {
      setIsProcessing(true);

      const response = await fetch(getApiUrl(`/api/group/${chat._id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "leave",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to leave group");
      }

      // Redirect to dashboard after leaving
      router.push("/dashboard");
    } catch (error) {
      console.error("Error leaving group:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Set up socket listeners
  useEffect(() => {
    if (!socket || !chatId) return;

    // Join the chat room
    if (socket && chatId) {
      socket.emit("chat:join", chatId);
    }

    // Listen for new messages in this chat
    socket.on("message:new", (message) => {
      if (message.chat === chatId) {
        // Add animation flag to new incoming messages
        setMessages((prev) => [...prev, { ...message, animate: true }]);

        // Scroll to bottom for new messages
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    });

    // Listen for edited messages
    socket.on("message:edit", (editedMessage) => {
      if (editedMessage.chat === chatId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editedMessage._id
              ? { ...editedMessage, animate: true }
              : msg
          )
        );
      }
    });

    // Listen for deleted messages
    socket.on("message:delete", ({ messageId, deleteForEveryone }) => {
      if (deleteForEveryone) {
        // For "delete for everyone", mark the message as deleted
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, deletedForEveryone: true, isDeleted: true }
              : msg
          )
        );
      } else {
        // For "delete for me", remove the message from the UI
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    });

    // Listen for typing indicators
    socket.on("typing:start", ({ chatId: typingChatId, userId, userName }) => {
      if (typingChatId === chatId && userId !== session?.user?.id) {
        setTyping(true);
      }
    });

    socket.on("typing:stop", ({ chatId: typingChatId, userId }) => {
      if (typingChatId === chatId && userId !== session?.user?.id) {
        setTyping(false);
      }
    });

    // Listen for message reads
    socket.on("message:read", ({ chatId: readChatId, userId, messageId }) => {
      if (readChatId === chatId) {
        setMessages((prev) =>
          prev.map((msg) =>
            messageId
              ? msg._id === messageId
                ? { ...msg, readBy: [...msg.readBy, userId] }
                : msg
              : { ...msg, readBy: [...msg.readBy, userId] }
          )
        );
      }
    });

    // Clean up
    return () => {
      // Leave the chat room
      if (socket && chatId) {
        socket.emit("chat:leave", chatId);
      }

      socket.off("message:new");
      socket.off("message:edit");
      socket.off("message:delete");
      socket.off("typing:start");
      socket.off("typing:stop");
      socket.off("message:read");
    };
  }, [socket, chatId, session]);

  // Get chat title
  const getChatTitle = () => {
    if (!chat) return "Loading...";

    if (chat.isGroup) {
      return chat.name;
    } else {
      const otherUser = chat.participants.find(
        (participant) => participant._id !== session?.user?.id
      );
      return otherUser?.name || "Chat";
    }
  };

  // Get chat status
  const getChatStatus = () => {
    if (!chat || chat.isGroup) return "";

    const otherUser = chat.participants.find(
      (participant) => participant._id !== session?.user?.id
    );

    if (otherUser?.isOnline) return "Online";

    if (otherUser?.lastSeen) {
      return `Last seen ${formatRelative(
        new Date(otherUser.lastSeen),
        new Date()
      )}`;
    }

    return "";
  };

  if (loading && !chat) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="spinner w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 animate-pulse">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-400 bg-red-400/10 px-4 py-3 rounded-lg border border-red-400/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Call Modal */}
      <CallModal />
      {/* Chat header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 px-4 py-3 border-b border-gray-700 flex items-center bg-dark-lighter z-10"
      >
        <div className="relative mr-3">
          {chat?.isGroup ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
              <Avatar
                src={chat.groupAvatar}
                name={chat.name}
                size="md"
              />
            </div>
          ) : (
            <>
              <img
                src={
                  chat?.participants.find((p) => p._id !== session?.user?.id)
                    ?.avatar ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(getChatTitle()) +
                    "&background=34B7F1&color=fff"
                }
                alt={getChatTitle()}
                className="w-10 h-10 rounded-full object-cover border-2 border-dark"
              />

              {!chat?.isGroup &&
                chat?.participants.find((p) => p._id !== session?.user?.id)
                  ?.isOnline && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"
                  ></motion.span>
                )}
            </>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{getChatTitle()}</h3>
          <p className="text-gray-400 text-xs">{getChatStatus()}</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Audio call button */}
          <button
            onClick={() => handleStartCall("audio")}
            className="text-gray-400 hover:text-green-500 p-2 rounded-full hover:bg-dark-light transition-colors"
            title="Audio call"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </button>

          {/* Video call button */}
          <button
            onClick={() => handleStartCall("video")}
            className="text-gray-400 hover:text-purple-500 p-2 rounded-full hover:bg-dark-light transition-colors"
            title="Video call"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </button>

          <div className="relative">
            <button
              className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-dark-light transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>

            {/* Menu dropdown */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-lighter border border-gray-700 rounded-md shadow-lg z-50">
                {chat?.isGroup ? (
                  <>
                    <div className="p-3 border-b border-gray-700">
                      <h3 className="text-white font-medium">Group Options</h3>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-light hover:text-white transition-colors flex items-center"
                      onClick={() => {
                        setShowMenu(false);
                        setShowParticipantsModal(true);
                      }}
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
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      View Participants
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-dark-light hover:text-red-300 transition-colors flex items-center"
                      onClick={() => {
                        setShowMenu(false);
                        handleLeaveGroup();
                      }}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Leave Group
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3 border-b border-gray-700">
                      <h3 className="text-white font-medium">Chat Options</h3>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-light hover:text-white transition-colors flex items-center"
                      onClick={() => {
                        setShowMenu(false);
                        handleViewProfile();
                      }}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      View Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-light hover:text-white transition-colors flex items-center"
                      onClick={() => {
                        setShowMenu(false);
                        handleBlockUser();
                      }}
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
                      Block User
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-light hover:text-white transition-colors flex items-center"
                      onClick={() => {
                        setShowMenu(false);
                        handleUnfollowUser();
                      }}
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor: chatBackgroundColor }}
        onScroll={handleScroll}
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="spinner w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {messages.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex h-full items-center justify-center"
          >
            <div className="text-center p-6 bg-dark-lighter bg-opacity-70 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                No messages yet
              </h3>
              <p className="text-gray-400 mb-4">
                Send a message to start the conversation!
              </p>
              <button
                onClick={() => messageInputRef.current?.focus()}
                className="text-primary hover:text-primary-dark"
              >
                Say hello 👋
              </button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <Message
                key={message._id}
                message={message}
                isOwnMessage={message.sender._id === session?.user?.id}
                isGroupChat={chat?.isGroup}
                previousMessage={index > 0 ? messages[index - 1] : null}
                onReplyClick={() => handleReplyTo(message)}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                animate={message.animate || initialLoad}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center ml-2 text-gray-400 text-sm"
            >
              <div className="flex space-x-1 mr-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-400"></div>
              </div>
              <span>typing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-t border-gray-700 p-3 bg-dark-lighter"
      >
        <MessageInput
          onSendMessage={sendMessage}
          onTyping={handleTyping}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
          ref={messageInputRef}
        />
      </motion.div>

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-lighter rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-medium text-lg">
                Group Participants
              </h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {chat?.participants?.map((participant) => (
                <div
                  key={participant._id}
                  className="flex items-center p-3 hover:bg-dark-light rounded-md transition-colors"
                >
                  <div className="relative mr-3">
                    <img
                      src={
                        participant.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          participant.name
                        )}&background=34B7F1&color=fff`
                      }
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {participant.name}
                      {participant._id === session?.user?.id && " (You)"}
                    </h4>
                    <p className="text-gray-400 text-xs truncate">
                      {participant.isOnline
                        ? "Online"
                        : participant.lastSeen
                        ? `Last seen ${formatRelative(
                            new Date(participant.lastSeen),
                            new Date()
                          )}`
                        : ""}
                    </p>
                  </div>
                  {participant._id === chat?.admin && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-lighter rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-medium text-lg">User Profile</h3>
              <button
                onClick={() => setShowUserProfileModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {/* User Profile Content */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="border-4 border-dark-lighter shadow-lg shadow-primary/20 rounded-full">
                    <Avatar
                      src={selectedUser.avatar}
                      name={selectedUser.name}
                      size="2xl"
                    />
                  </div>
                  {selectedUser.isOnline && (
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {selectedUser.name}
                </h2>

                {selectedUser.status && (
                  <div className="mt-2 text-gray-300 text-center max-w-md">
                    <svg
                      className="w-4 h-4 inline-block mr-1 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
                    </svg>
                    "{selectedUser.status}"
                  </div>
                )}

                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  <div className="bg-dark p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-white">
                      {selectedUser.followers?.length || 0}
                    </p>
                    <p className="text-xs text-gray-400">Followers</p>
                  </div>
                  <div className="bg-dark p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-white">
                      {selectedUser.following?.length || 0}
                    </p>
                    <p className="text-xs text-gray-400">Following</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center w-full">
                  <button
                    onClick={() => {
                      setShowUserProfileModal(false);
                      handleBlockUser();
                    }}
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
                  <button
                    onClick={() => {
                      setShowUserProfileModal(false);
                      handleUnfollowUser();
                    }}
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
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setShowUserProfileModal(false)}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
