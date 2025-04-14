'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/apiUtils';

export default function UsernameSetupModal() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  useEffect(() => {
    // Check if the user needs to set a username
    if (session?.user?.needsUsername) {
      setIsVisible(true);
    }
  }, [session]);
  
  // Handle close button click
  const handleCloseClick = () => {
    // If username is required, show confirmation dialog
    if (session?.user?.needsUsername) {
      setShowConfirmation(true);
    } else {
      // If username is not required, just close the modal
      setIsVisible(false);
    }
  };
  
  // Handle confirmation dialog close
  const handleConfirmClose = async () => {
    setShowConfirmation(false);
    setIsVisible(false);
    
    // Sign out the user and redirect to login page
    await signOut({ callbackUrl: '/login' });
  };
  
  // Handle confirmation dialog cancel
  const handleCancelClose = () => {
    setShowConfirmation(false);
  };
  
  const validateUsername = () => {
    // Username must be 3-20 characters and only contain letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters and can only contain letters, numbers, and underscores');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUsername()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(getApiUrl('/api/users/set-username'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set username');
      }
      
      // Update the session to remove the needsUsername flag
      await update({
        ...session,
        user: {
          ...session.user,
          needsUsername: false,
        },
      });
      
      // Close the modal
      setIsVisible(false);
      
      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-md p-6 bg-dark-lighter rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
            <p className="text-gray-300 mb-6">
              Setting a username is required to use NiChat. If you close this dialog, you will be signed out.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleCancelClose}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
              >
                Close & Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md p-6 bg-dark-lighter rounded-lg shadow-xl relative">
        {/* Close button */}
        <button
          onClick={handleCloseClick}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-4 pr-8">Set Your Username</h2>
        <p className="text-gray-300 mb-6">
          Welcome to NiChat! Please choose a unique username to continue.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
              placeholder="Choose a unique username"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Only letters, numbers, and underscores. 3-20 characters.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting Username...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
