'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getApiUrl } from '@/lib/apiUtils';
import Link from 'next/link';
import useSocket from '@/hooks/useSocket';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('notification:new', handleNewNotification);

    // Cleanup
    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, isConnected]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
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

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark this notification as read
    if (!notification.read) {
      fetch(getApiUrl('/api/users/notifications'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds: [notification._id] }),
      }).catch(error => {
        console.error('Error marking notification as read:', error);
      });

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        )
      );
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'follow':
      case 'request':
      case 'accept':
        // Navigate to profile page
        window.location.href = `/profile`;
        break;
      case 'message':
        // Navigate to chat
        if (notification.chatId) {
          window.location.href = `/chat/${notification.chatId}`;
        }
        break;
      default:
        // Default to profile
        window.location.href = `/profile`;
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/chat" className="mr-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <h1 className="text-white font-semibold text-xl">Notifications</h1>
        </div>
        
        {notifications.some(notification => !notification.read) && (
          <button
            onClick={markAllAsRead}
            className="text-primary hover:text-primary-light text-sm"
          >
            Mark all as read
          </button>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4 text-red-200 text-sm">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h2 className="text-xl font-medium text-white mb-2">No notifications yet</h2>
            <p className="text-gray-400">
              When you receive notifications, they'll appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors ${
                    !notification.read 
                      ? 'bg-dark-lighter border-l-4 border-primary' 
                      : 'bg-dark-lighter hover:bg-dark-light'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mr-4">
                    {notification.from?.avatar ? (
                      <img 
                        src={notification.from.avatar}
                        alt={notification.from?.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-xl">
                        {(notification.from?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white">
                      {renderNotificationMessage(notification)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
