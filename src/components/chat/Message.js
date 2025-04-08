"use client";

import { useState } from "react";
import { formatRelative } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const Message = ({
  message,
  isOwnMessage,
  isGroupChat,
  previousMessage,
  onReplyClick,
  animate = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { content, contentType, sender, createdAt, readBy, replyTo } = message;

  // Check if this message is from the same sender as the previous one
  const isSameSender =
    previousMessage && previousMessage.sender._id === sender._id;

  // Format timestamp
  const formattedTime = formatRelative(new Date(createdAt), new Date());

  // Get short form of time (just for display)
  const getShortTime = () => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle different content types
  const renderContent = () => {
    switch (contentType) {
      case "text":
        return <p className="whitespace-pre-wrap">{content}</p>;
      case "image":
        return (
          <div className="my-1 relative group">
            <img
              src={message.fileUrl}
              alt="Image"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-end">
              <div className="p-2 text-white text-xs">
                {message.fileName || "Image"}
              </div>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="my-1">
            <div className="bg-dark-light p-2 rounded-lg">
              <audio controls className="max-w-xs">
                <source src={message.fileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="text-xs text-gray-400 mt-1">
                {message.fileName || "Audio message"}
              </div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="my-1 relative group">
            <video controls className="max-w-xs rounded-lg" preload="metadata">
              <source src={message.fileUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
            <div className="absolute top-0 right-0 m-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {message.fileName || "Video"}
            </div>
          </div>
        );
      case "file":
        return (
          <div className="my-1 bg-dark-light p-3 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3 bg-primary/10 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
                  <path d="M14 8V2L20 8H14Z" fill="white" fillOpacity="0.5" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">
                  {message.fileName || "File"}
                </p>
                <p className="text-gray-400 text-xs">
                  {message.fileSize
                    ? `${(message.fileSize / 1024).toFixed(1)} KB`
                    : ""}
                </p>
              </div>
            </div>
            <button
              className="mt-2 text-primary text-sm hover:underline flex items-center"
              onClick={() => window.open(message.fileUrl, "_blank")}
            >
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </button>
          </div>
        );
      default:
        return <p>{content}</p>;
    }
  };

  // Show reply if exists
  const renderReply = () => {
    if (!replyTo) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 border-l-2 border-gray-600 pl-2 py-1 text-xs bg-dark-light bg-opacity-50 rounded-md flex items-start"
      >
        <div className="mr-2 flex-shrink-0">
          <svg
            className="w-3 h-3 text-gray-400 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 14 4 9 9 4"></polyline>
            <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 font-medium">{replyTo.sender.name}</p>
          <p className="text-gray-300 truncate">
            {replyTo.contentType === "text"
              ? replyTo.content
              : replyTo.contentType === "image"
              ? "📷 Image"
              : replyTo.contentType === "audio"
              ? "🔊 Audio"
              : replyTo.contentType === "video"
              ? "🎬 Video"
              : "📎 File"}
          </p>
        </div>
      </motion.div>
    );
  };

  const messageVariants = {
    hidden: {
      opacity: 0,
      x: isOwnMessage ? 20 : -20,
      y: 5,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} ${
        isSameSender ? "mt-1" : "mt-4"
      }`}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      variants={messageVariants}
      onHoverStart={() => setShowOptions(true)}
      onHoverEnd={() => setShowOptions(false)}
    >
      <div className="flex items-end max-w-[75%]">
        {/* Sender avatar (only show for group chats and messages not sent by current user) */}
        {isGroupChat && !isOwnMessage && !isSameSender && (
          <div className="mr-2 mb-1">
            <img
              src={
                sender.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  sender.name
                )}&background=34B7F1&color=fff`
              }
              alt={sender.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}

        {/* Space for alignment when no avatar is shown but previous message was from different sender */}
        {isGroupChat && !isOwnMessage && isSameSender && (
          <div className="w-10" />
        )}

        <div
          className={`rounded-lg p-3 relative group ${
            isOwnMessage
              ? "bg-chat-outgoing text-dark-lighter rounded-tr-none"
              : "bg-chat-incoming text-dark-lighter rounded-tl-none"
          }`}
        >
          {/* Sender name for group chats */}
          {isGroupChat && !isOwnMessage && !isSameSender && (
            <p className="text-sm font-medium text-primary-dark mb-1">
              {sender.name}
            </p>
          )}

          {/* Reply */}
          {renderReply()}

          {/* Message content */}
          {renderContent()}

          {/* Time and read status */}
          <div
            className={`text-right mt-1 text-xs flex items-center justify-end ${
              isOwnMessage ? "text-dark-light" : "text-gray-500"
            }`}
          >
            {getShortTime()}
            {isOwnMessage && readBy && readBy.length > 1 && (
              <span className="ml-1 text-primary">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm-7.75 7.75L9 15l-3-3-1.41 1.41L9 17.84 16.41 10.42 15 9l-4.75 4.75z" />
                </svg>
              </span>
            )}
          </div>

          {/* Message options */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`absolute ${
                  isOwnMessage
                    ? "left-0 -translate-x-full -ml-2"
                    : "right-0 translate-x-full mr-2"
                } top-0 bg-dark-lighter rounded-lg shadow-lg p-1 flex space-x-1`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplyClick(message);
                  }}
                  className="p-1.5 hover:bg-dark-light rounded-md text-gray-300 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 14 4 9 9 4"></polyline>
                    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                  </svg>
                </button>

                <button className="p-1.5 hover:bg-dark-light rounded-md text-gray-300 hover:text-primary transition-colors">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>

                {isOwnMessage && (
                  <button className="p-1.5 hover:bg-dark-light rounded-md text-gray-300 hover:text-red-500 transition-colors">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
