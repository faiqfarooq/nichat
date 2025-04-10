'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getApiUrl } from '@/lib/apiUtils';
import Link from 'next/link';
import useSocket from '@/hooks/useSocket';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  const { socket, isConnected } = useSocket();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/users/notifications'));
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for new notifications via WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Add notification to state
      setNotifications(prev => [notification, ...prev]);
      
      // Close the notification panel if it's open
      if (isOpen) {
        setIsOpen(false);
      }
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:follow', handleNewNotification);
    socket.on('notification:request', handleNewNotification);
    socket.on('notification:accept', handleNewNotification);

    // Cleanup
    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:follow', handleNewNotification);
      socket.off('notification:request', handleNewNotification);
      socket.off('notification:accept', handleNewNotification);
    };
  }, [socket, isConnected, isOpen]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark notifications as read
  const markAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      if (unreadNotifications.length === 0) return;
      
      const notificationIds = unreadNotifications.map(notification => notification._id);
      
      const response = await fetch(getApiUrl('/api/users/notifications'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          read: true
        }))
      );
      
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      markAsRead();
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Render notification message
  const renderNotificationMessage = (notification) => {
    const userName = notification.from?.name || 'Someone';
    
    switch (notification.type) {
      case 'follow':
        return (
          <span>
            <span className="font-medium">{userName}</span> started following you
          </span>
        );
      case 'request':
        return (
          <span>
            <span className="font-medium">{userName}</span> requested to connect with you
          </span>
        );
      case 'accept':
        return (
          <span>
            <span className="font-medium">{userName}</span> accepted your connection request
          </span>
        );
      case 'message':
        return (
          <span>
            <span className="font-medium">{userName}</span> sent you a message
          </span>
        );
      default:
        return (
          <span>
            <span className="font-medium">{userName}</span> interacted with you
          </span>
        );
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-400 hover:text-white focus:outline-none"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-dark-lighter border border-gray-700 rounded-md shadow-lg z-50"
          >
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-medium">Notifications</h3>
              <Link href="/notifications" className="text-xs text-primary hover:text-primary-light">
                View All
              </Link>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="spinner w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-sm text-red-300">
                  {error}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications yet
                </div>
              ) : (
                <ul>
                  {notifications.slice(0, 5).map((notification) => (
                    <li 
                      key={notification._id} 
                      className={`p-3 border-b border-gray-700 hover:bg-dark-light transition-colors ${!notification.read ? 'bg-dark-light/30' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {notification.from?.avatar ? (
                            <img 
                              src={notification.from.avatar}
                              alt={notification.from?.name || 'User'}
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-lg">
                              {(notification.from?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-300">
                            {renderNotificationMessage(notification)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                  
                  {notifications.length > 5 && (
                    <li className="p-3 text-center">
                      <Link href="/notifications" className="text-xs text-primary hover:text-primary-light">
                        View {notifications.length - 5} more
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;
