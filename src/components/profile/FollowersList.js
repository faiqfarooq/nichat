'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getApiUrl } from '@/lib/apiUtils';

const FollowersList = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStates, setActionStates] = useState({});
  const [following, setFollowing] = useState([]);

  // Fetch followers
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl('/api/users/followers'));
        
        if (!response.ok) {
          throw new Error('Failed to fetch followers');
        }
        
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.error('Error fetching followers:', error);
        setError('Failed to load followers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowers();
  }, []);

  // Fetch following list to check if we're already following these users
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(getApiUrl('/api/users/following'));
        
        // Even if response is not OK, we'll just use an empty array
        // This prevents errors from breaking the UI
        const followingList = response.ok ? await response.json() : [];
        setFollowing(followingList);
        
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4 text-red-200 text-sm">
        {error}
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No followers yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-4">Your Followers</h3>
      
      <AnimatePresence>
        {followers.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg"
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
              
              <div>
                <h4 className="text-white font-medium">{user.name}</h4>
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
            
            <div className="flex space-x-2">
              {user.isPrivate ? (
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
                ) : actionStates[user._id]?.requested ? (
                  <motion.button
                    disabled
                    className="px-3 py-1.5 bg-secondary opacity-50 text-white text-sm font-medium rounded"
                  >
                    Requested
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddContact(user._id, true)}
                    disabled={actionStates[user._id]?.requesting}
                    className="px-3 py-1.5 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                  >
                    Request
                  </motion.button>
                )
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
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = `/chat/${user._id}`}
                className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-dark text-sm font-medium rounded transition-colors"
              >
                Message
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FollowersList;
