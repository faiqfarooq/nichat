'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const ChatItem = ({ chat, active, currentUserId }) => {
  const router = useRouter();

  const isGroup = chat.isGroup;
  
  // For 1-on-1 chats, get the other user
  const otherUser = isGroup 
    ? null 
    : chat.participants.find(
        (participant) => participant._id !== currentUserId
      );
  
  // Display name (group name or other user's name)
  const displayName = isGroup 
    ? chat.name 
    : otherUser?.name || 'Unknown User';
  
  // Display avatar
  const displayAvatar = isGroup 
    ? chat.groupAvatar 
    : otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=34B7F1&color=fff`;
  
  // Display online status (only for 1-on-1 chats)
  const isOnline = !isGroup && otherUser?.isOnline;
  
  // Format last message
  const getLastMessageText = () => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const { content, contentType, sender } = chat.lastMessage;
    const isSentByMe = sender._id === currentUserId;
    const prefix = isGroup 
      ? (isSentByMe ? 'You: ' : `${sender.name.split(' ')[0]}: `) 
      : (isSentByMe ? 'You: ' : '');
    
    if (contentType === 'text') {
      return `${prefix}${content}`;
    } else if (contentType === 'image') {
      return `${prefix}📷 Photo`;
    } else if (contentType === 'audio') {
      return `${prefix}🔊 Audio`;
    } else if (contentType === 'video') {
      return `${prefix}🎬 Video`;
    } else if (contentType === 'file') {
      return `${prefix}📎 File`;
    }
    
    return 'New message';
  };
  
  // Format last message time
  const getLastMessageTime = () => {
    if (!chat.lastMessage) return '';
    
    const lastMessageDate = new Date(chat.lastMessage.createdAt);
    
    // If today, show time, otherwise show date
    const now = new Date();
    if (
      lastMessageDate.getDate() === now.getDate() &&
      lastMessageDate.getMonth() === now.getMonth() &&
      lastMessageDate.getFullYear() === now.getFullYear()
    ) {
      return lastMessageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return formatDistanceToNow(lastMessageDate, { addSuffix: false });
  };
  
  // Get unread count for current user
  // Handle both Map objects and plain objects from API
  const unreadCount = chat.unreadCount 
    ? (typeof chat.unreadCount.get === 'function' 
        ? chat.unreadCount.get(currentUserId) 
        : chat.unreadCount[currentUserId])
    : 0;

  // Navigate to chat
  const handleClick = () => {
    router.push(`/chat/${chat._id}`);
  };

  return (
    <motion.li 
      onClick={handleClick}
      whileHover={{ backgroundColor: active ? 'rgba(42, 57, 66, 0.95)' : 'rgba(42, 57, 66, 0.7)' }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
        active 
          ? 'bg-dark-light border-l-4 border-l-primary' 
          : 'hover:bg-dark-light border-l-4 border-l-transparent'
      }`}
    >
      <div className="relative">
        {isGroup ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
            {chat.name?.charAt(0).toUpperCase() || 'G'}
          </div>
        ) : (
          <img 
            src={displayAvatar}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border border-gray-700" 
          />
        )}
        
        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-white font-medium truncate">{displayName}</h4>
          <span className="text-xs text-gray-400 flex-shrink-0">{getLastMessageTime()}</span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-400 text-sm truncate max-w-[70%]">
            {getLastMessageText()}
          </p>
          
          {unreadCount > 0 && (
            <span className="bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default ChatItem;
