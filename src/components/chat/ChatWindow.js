'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { formatRelative } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Message';
import MessageInput from './MessageInput';
import { useSocket } from '@/hooks/useSocket';
import { getApiUrl } from '@/lib/apiUtils';

const ChatWindow = ({ chatId }) => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [typing, setTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // Fetch chat details
  const fetchChat = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/chats/${chatId}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat');
      }
      
      const data = await response.json();
      setChat(data);
    } catch (error) {
      console.error('Error loading chat:', error);
      setError('Could not load chat details');
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
        throw new Error('Failed to fetch messages');
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
      console.error('Error loading messages:', error);
      setError('Could not load messages');
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send a message
  const sendMessage = async (content, contentType = 'text', replyToId = null) => {
    try {
      // Reset typing indicator
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Notify other users that typing has stopped
      if (socket) {
        socket.emit('typing:stop', { chatId });
      }
      
      // Clear reply to
      const actualReplyTo = replyToId || (replyTo ? replyTo._id : null);
      setReplyTo(null);
      
      // Send message via socket if available
      if (socket && socket.connected) {
        socket.emit('message:new', {
          chatId,
          content,
          contentType,
          replyTo: actualReplyTo,
        });
        
        // Focus the input field again
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
        
        return;
      }
      
      // Fallback to API if socket is not available
      const response = await fetch(getApiUrl('/api/messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          content,
          contentType,
          replyTo: actualReplyTo,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Add message to state with animation
      setMessages((prev) => [...prev, {...newMessage, animate: true}]);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      // Focus the input field again
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      
      // Emit typing event
      if (socket) {
        socket.emit('typing:start', { chatId });
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
        socket.emit('typing:stop', { chatId });
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

  // Initialize chat and messages
  useEffect(() => {
    if (chatId && session) {
      setInitialLoad(true);
      fetchChat();
      fetchMessages();
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, session]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket || !chatId) return;
    
    // Join the chat room
    if (socket && chatId) {
      socket.emit('chat:join', chatId);
    }

    // Listen for new messages in this chat
    socket.on('message:new', (message) => {
      if (message.chat === chatId) {
        // Add animation flag to new incoming messages
        setMessages((prev) => [...prev, {...message, animate: true}]);
        
        // Scroll to bottom for new messages
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    });
    
    // Listen for typing indicators
    socket.on('typing:start', ({ chatId: typingChatId, userId, userName }) => {
      if (typingChatId === chatId && userId !== session?.user?.id) {
        setTyping(true);
      }
    });
    
    socket.on('typing:stop', ({ chatId: typingChatId, userId }) => {
      if (typingChatId === chatId && userId !== session?.user?.id) {
        setTyping(false);
      }
    });
    
    // Listen for message reads
    socket.on('message:read', ({ chatId: readChatId, userId, messageId }) => {
      if (readChatId === chatId) {
        setMessages((prev) => 
          prev.map((msg) => 
            messageId ? (msg._id === messageId ? { ...msg, readBy: [...msg.readBy, userId] } : msg)
            : { ...msg, readBy: [...msg.readBy, userId] }
          )
        );
      }
    });
    
    // Clean up
    return () => {
      // Leave the chat room
      if (socket && chatId) {
        socket.emit('chat:leave', chatId);
      }
      
      socket.off('message:new');
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('message:read');
    };
  }, [socket, chatId, session]);

  // Get chat title
  const getChatTitle = () => {
    if (!chat) return 'Loading...';
    
    if (chat.isGroup) {
      return chat.name;
    } else {
      const otherUser = chat.participants.find(
        (participant) => participant._id !== session?.user?.id
      );
      return otherUser?.name || 'Chat';
    }
  };

  // Get chat status
  const getChatStatus = () => {
    if (!chat || chat.isGroup) return '';
    
    const otherUser = chat.participants.find(
      (participant) => participant._id !== session?.user?.id
    );
    
    if (otherUser?.isOnline) return 'Online';
    
    if (otherUser?.lastSeen) {
      return `Last seen ${formatRelative(new Date(otherUser.lastSeen), new Date())}`;
    }
    
    return '';
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
              {chat?.name?.charAt(0).toUpperCase() || 'G'}
            </div>
          ) : (
            <>
              <img 
                src={chat?.participants.find(p => p._id !== session?.user?.id)?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(getChatTitle()) + "&background=34B7F1&color=fff"}
                alt={getChatTitle()}
                className="w-10 h-10 rounded-full object-cover border-2 border-dark" 
              />
              
              {!chat?.isGroup && chat?.participants.find(p => p._id !== session?.user?.id)?.isOnline && (
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
          <button className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-dark-light transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </button>
          
          <button className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-dark-light transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 3H3v18h18V3zM9 13l3 3 9-9"></path>
            </svg>
          </button>
          
          <button className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-dark-light transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </motion.div>
      
      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://i.imgur.com/vRfXi7q.png')] bg-opacity-5 bg-repeat"
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
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-gray-400 mb-4">Send a message to start the conversation!</p>
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
    </div>
  );
};

export default ChatWindow;
