'use client';

import { formatDistanceToNow } from 'date-fns';

const SearchResults = ({ results, isLoading, onSelectUser }) => {
  if (isLoading) {
    return (
      <div className="p-3 flex justify-center">
        <div className="spinner w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-gray-400 text-center">
        No users found
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-700">
      {results.map((user) => (
        <li 
          key={user._id}
          onClick={() => onSelectUser(user)}
          className="flex items-center px-4 py-3 hover:bg-dark-light cursor-pointer transition"
        >
          <div className="relative">
            <img 
              src={user.avatar || '/assets/images/default-avatar.png'} 
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover" 
            />
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
            )}
          </div>
          
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h4 className="text-white font-medium truncate">{user.name}</h4>
              <span className="text-xs text-gray-400">
                {user.isOnline
                  ? 'Online'
                  : user.lastSeen
                  ? `Last seen ${formatDistanceToNow(new Date(user.lastSeen))} ago`
                  : ''}
              </span>
            </div>
            
            <div className="mt-1">
              <p className="text-gray-400 text-sm truncate">
                {user.status || 'Hey there! I am using Chat App'}
              </p>
              {user.isPrivate && (
                <span className="inline-block mt-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                  Private account
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;