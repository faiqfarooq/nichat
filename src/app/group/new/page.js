'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/search/SearchBar';
import Avatar from '@/components/ui/Avatar';
import useUserData from '@/hooks/useUserData';
import { getApiUrl } from '@/lib/apiUtils';

export default function NewGroupPage() {
  const { data: session, status } = useSession();
  const { user: userData } = useUserData();
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [groupImagePreview, setGroupImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef(null);

  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulate loading time and then set loaded state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearchLoading(true);
      setError('');
      
      const response = await fetch(getApiUrl(`/api/users/search?query=${encodeURIComponent(query)}`));
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      
      // Filter out already selected users and current user
      const filteredResults = data.filter(
        user => user._id !== session?.user?.id && !selectedUsers.some(selected => selected._id === user._id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching');
    } finally {
      setSearchLoading(false);
    }
  };

  // Add user to selected users
  const addUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchResults(searchResults.filter(result => result._id !== user._id));
    setSearchQuery('');
  };

  // Remove user from selected users
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setGroupImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setGroupImage(file);
  };
  
  // Create group
  const createGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    
    if (selectedUsers.length < 1) {
      setError('Please select at least one user');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Upload group image if selected
      let groupImageUrl = null;
      if (groupImage) {
        const formData = new FormData();
        formData.append('file', groupImage);
        
        const imageResponse = await fetch(getApiUrl('/api/upload/image'), {
          method: 'POST',
          body: formData,
        });
        
        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.error || 'Failed to upload group image');
        }
        
        const imageResult = await imageResponse.json();
        groupImageUrl = imageResult.url;
      }
      
      // Log what we're about to do
      console.log('Creating group chat with name:', groupName);
      console.log('Group image URL:', groupImageUrl);
      console.log('Selected users:', selectedUsers);
      
      // Use the dedicated create-group API endpoint
      const response = await fetch(getApiUrl('/api/create-group'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          groupAvatar: groupImageUrl,
          participants: selectedUsers.map(user => user._id),
        }),
      });
      
      // Log the response status
      console.log('Response status:', response.status);
      
      // Get the response text first to log it
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Parse the response if it's valid JSON
      let chat;
      try {
        chat = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        throw new Error(chat.error || 'Failed to create group');
      }
      
      console.log('Created group chat:', chat);
      
      // Show success message
      alert('Group created successfully!');
      
      // Navigate to the chat
      router.push(`/chat/${chat._id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (status === 'loading' || !isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-secondary border-b-transparent animate-spin animation-delay-500"></div>
            <svg 
              className="absolute inset-0 w-20 h-20 text-primary-light opacity-80"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path 
                d="M70 30H30C27.2 30 25 32.2 25 35V75L35 65H70C72.8 65 75 62.8 75 60V35C75 32.2 72.8 30 70 30Z" 
                stroke="currentColor" 
                strokeWidth="2" 
              />
            </svg>
          </div>
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-dark">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center">
          <Link href="/chat" className="text-gray-400 hover:text-white mr-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <h1 className="text-xl font-semibold text-white">Create New Group</h1>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={createGroup}
          disabled={loading || !groupName.trim() || selectedUsers.length < 1}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create'}
        </motion.button>
      </motion.header>
      
      <div className="flex-1 overflow-y-auto">
        {/* Group info */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-dark-lighter"
        >
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4 text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex items-start mb-6">
            <div className="relative mr-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 shadow-md">
                <Avatar 
                  src={groupImagePreview} 
                  name={groupName || 'Group'} 
                  size="xl"
                />
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-dark p-1.5 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg"
                title="Change group picture"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name"
                className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white mb-2"
              />
              <p className="text-gray-400 text-sm">
                {selectedUsers.length} {selectedUsers.length === 1 ? 'participant' : 'participants'}
              </p>
            </div>
          </div>
          
          {/* Search bar */}
          <SearchBar 
            onSearch={handleSearch} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for participants"
          />
        </motion.div>
        
        {/* Search results */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-gray-700 overflow-hidden"
            >
              <div className="p-4">
                <h2 className="text-sm font-medium text-gray-400 mb-2">Search Results</h2>
                
                {searchLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="spinner w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map(user => (
                      <motion.li
                        key={user._id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        className="flex items-center justify-between p-2 hover:bg-dark-light rounded transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="relative mr-3">
                            <Avatar 
                              src={user.avatar} 
                              name={user.name} 
                              size="md"
                            />
                            {user.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-white font-medium">{user.name}</h3>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addUser(user)}
                          className="p-2 text-primary hover:bg-dark rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-center py-4">No users found</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Selected users */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4"
        >
          <h2 className="text-sm font-medium text-gray-400 mb-4">Participants</h2>
          
          {selectedUsers.length > 0 ? (
            <ul className="space-y-2">
              {selectedUsers.map(user => (
                <motion.li
                  key={user._id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex items-center justify-between p-2 bg-dark-lighter rounded"
                >
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Avatar 
                        src={user.avatar} 
                        name={user.name} 
                        size="md"
                      />
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeUser(user._id)}
                    className="p-2 text-red-400 hover:bg-dark rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-dark-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p className="text-gray-400">Search and add participants to your group</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
