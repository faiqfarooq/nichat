'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getApiUrl } from '@/lib/apiUtils';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStates, setActionStates] = useState({});

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl('/api/users/pending-requests'));
        
        if (!response.ok) {
          throw new Error('Failed to fetch pending requests');
        }
        
        const data = await response.json();
        setPendingRequests(data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        setError('Failed to load pending requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingRequests();
  }, []);

  const [successMessage, setSuccessMessage] = useState('');

  // Handle accepting a request
  const handleAcceptRequest = async (userId, userName) => {
    try {
      setActionStates(prev => ({
        ...prev,
        [userId]: { ...prev[userId], processing: true }
      }));
      
      const response = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'acceptRequest' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }
      
      // Remove from pending requests list
      setPendingRequests(prev => prev.filter(user => user._id !== userId));
      
      // Show success message
      setSuccessMessage(`You accepted ${userName}'s request. You can now chat with each other!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error accepting request:', error);
      setActionStates(prev => ({
        ...prev,
        [userId]: { ...prev[userId], processing: false, error: 'Failed to accept request' }
      }));
    }
  };

  // Handle rejecting a request
  const handleRejectRequest = async (userId) => {
    try {
      setActionStates(prev => ({
        ...prev,
        [userId]: { ...prev[userId], processing: true }
      }));
      
      const response = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'rejectRequest' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      
      // Remove from pending requests list
      setPendingRequests(prev => prev.filter(user => user._id !== userId));
      
    } catch (error) {
      console.error('Error rejecting request:', error);
      setActionStates(prev => ({
        ...prev,
        [userId]: { ...prev[userId], processing: false, error: 'Failed to reject request' }
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
  
  if (successMessage) {
    return (
      <div className="bg-green-500/20 border border-green-500 rounded p-3 mb-4 text-green-200 text-sm">
        {successMessage}
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-4">Pending Requests</h3>
      
      <AnimatePresence>
        {pendingRequests.map((user) => (
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAcceptRequest(user._id, user.name)}
                disabled={actionStates[user._id]?.processing}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
              >
                Accept
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRejectRequest(user._id)}
                disabled={actionStates[user._id]?.processing}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
              >
                Reject
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PendingRequests;
