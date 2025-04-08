'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const SearchResults = ({ results, onStartChat, currentUserId }) => {
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
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=34B7F1&color=fff`}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover" 
              />
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStartChat(user._id)}
              className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-dark text-sm font-medium rounded transition-colors"
            >
              Message
            </motion.button>
          )}
        </motion.li>
      ))}
    </ul>
  );
};

export default SearchResults;
