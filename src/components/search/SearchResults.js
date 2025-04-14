'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/apiUtils';

const SearchResults = ({ results, onStartChat, currentUserId }) => {
  const [actionStates, setActionStates] = useState({});
  
  // Check if user is already followed
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(getApiUrl('/api/users/following'));
        
        // Even if response is not OK, we'll just use an empty array
        // This prevents errors from breaking the UI
        const followingList = response.ok ? await response.json() : [];
        
        // Update action states based on following list
        const newActionStates = {};
        followingList.forEach(user => {
          if (user && user._id) {
            newActionStates[user._id] = { 
              ...actionStates[user._id],
              followed: true 
            };
          }
        });
        
        setActionStates(prev => ({
          ...prev,
          ...newActionStates
        }));
      } catch (error) {
        console.error('Error checking follow status:', error);
        // Continue with empty following list on error
      }
    };
    
    checkFollowStatus();
  }, []);

  // Handle adding a contact (follow or request)
  const handleAddContact = async (userId, isPrivate) => {
    try {
      setActionStates(prev => ({
        ...prev,
        [userId]: { 
          ...prev[userId],
          requesting: true 
        }
      }));
      
      const response = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'addContact' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add contact');
      }
      
      // Update button state
      setActionStates(prev => ({
        ...prev,
        [userId]: { 
          ...prev[userId],
          requesting: false,
          requested: isPrivate ? true : false,
          followed: true
        }
      }));
      
    } catch (error) {
      console.error('Error adding contact:', error);
      setActionStates(prev => ({
        ...prev,
        [userId]: { 
          ...prev[userId],
          requesting: false 
        }
      }));
    }
  };
  
  // Handle unfollowing a user
  const handleUnfollow = async (userId) => {
    try {
      setActionStates(prev => ({
        ...prev,
        [userId]: { 
          ...prev[userId],
          requesting: true 
        }
      }));
      
      const response = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'removeContact' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
      
      // Update button state
      setActionStates(prev => ({
        ...prev,
        [userId]: { 
          ...prev[userId],
          requesting: false,
          requested: false,
          followed: false
        }
      }));
      
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setActionStates(prev => ({
        ...prev,
        [userId]: { 
          ...prev[userId],
          requesting: false 
        }
      }));
    }
  };

  return (
    <ul className="space-y-2">
      {results.map((user) => (
        <motion.li 
          key={user._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg hover:bg-dark-light transition-colors"
        >
          <div className="flex items-center">
            <div className="relative mr-3">
              {user.avatar ? (
                <img 
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
              )}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center">
                <h4 className="text-white font-medium truncate">{user.name}</h4>
                {user._id === currentUserId && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                    You
                  </span>
                )}
                {user.isPrivate && (
                  <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    Private
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm">
                <p className="text-gray-400 truncate">
                  {user.status || 'Hey there! I am using Chat App'}
                </p>
                <span className="mx-2 text-gray-600">•</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {user.isOnline
                    ? 'Online'
                    : user.lastSeen
                    ? `Last seen ${formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}`
                    : ''}
                </span>
              </div>
            </div>
          </div>
          
          {user._id !== currentUserId && (
            <div className="flex space-x-2">
              {user.isPrivate ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddContact(user._id, true)}
                  disabled={actionStates[user._id]?.requesting || actionStates[user._id]?.requested}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                >
                  {actionStates[user._id]?.requested ? 'Requested' : 'Request'}
                </motion.button>
              ) : (
                actionStates[user._id]?.followed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUnfollow(user._id)}
                    disabled={actionStates[user._id]?.requesting}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                  >
                    Unfollow
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddContact(user._id, false)}
                    disabled={actionStates[user._id]?.requesting}
                    className="px-3 py-1.5 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                  >
                    Follow
                  </motion.button>
                )
              )}
              
              {user.isPrivate && !actionStates[user._id]?.followed ? (
                <motion.button
                  disabled
                  className="px-3 py-1.5 bg-gray-600 text-gray-300 text-sm font-medium rounded opacity-50 cursor-not-allowed"
                  title="You can message this user after they accept your request"
                >
                  Message
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStartChat(user._id)}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-dark text-sm font-medium rounded transition-colors"
                >
                  Message
                </motion.button>
              )}
            </div>
          )}
        </motion.li>
      ))}
    </ul>
  );
};

export default SearchResults;
