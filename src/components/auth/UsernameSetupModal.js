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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [usernameSet, setUsernameSet] = useState(false); // Track if username has been set successfully
  
  // Force redirect to dashboard if username has been set
  useEffect(() => {
    if (usernameSet) {
      // Close the modal
      setIsVisible(false);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, [usernameSet]);
  
  // Add a safety mechanism to force close the modal after a certain time
  useEffect(() => {
    // If the modal is visible and we're not in the process of setting a username
    if (isVisible && !loading && success === '') {
      // Set a timeout to force close the modal and redirect after 10 seconds
      const forceCloseTimer = setTimeout(() => {
        console.log('Force closing username modal due to timeout');
        setIsVisible(false);
        window.location.href = '/dashboard';
      }, 10000); // 10 seconds
      
      return () => clearTimeout(forceCloseTimer);
    }
  }, [isVisible, loading, success]);
  
  useEffect(() => {
    // Debug logging
    console.log('Session state:', {
      hasSession: !!session,
      needsUsername: session?.user?.needsUsername,
      username: session?.user?.username,
      usernameSet: usernameSet,
      isVisible: isVisible
    });
    
    // Check if the user needs to set a username
    if (session?.user?.needsUsername && !usernameSet) {
      console.log('Showing username modal - user needs username');
      setIsVisible(true);
    } else if (session?.user) {
      // Explicitly hide the modal if the user doesn't need a username
      console.log('Hiding username modal - user does not need username');
      setIsVisible(false);
      
      // If we have a session but the modal was visible, force redirect to dashboard
      if (isVisible) {
        console.log('Force redirecting to dashboard');
        window.location.href = '/dashboard';
      }
    }
  }, [session, usernameSet, isVisible]);
  
  // Handle close button click - defined before the useEffect that depends on it
  const handleCloseClick = () => {
    console.log('Close button clicked');
    
    // If success message is shown, close and redirect to dashboard
    if (success) {
      console.log('Success message shown, redirecting to dashboard');
      setIsVisible(false);
      window.location.href = '/dashboard';
      return;
    }
    
    // Force close if user has clicked multiple times (user is likely frustrated)
    if (showConfirmation) {
      console.log('Confirmation already shown, force closing');
      setShowConfirmation(false);
      setIsVisible(false);
      window.location.href = '/dashboard';
      return;
    }
    
    // If username is required, show confirmation dialog
    if (session?.user?.needsUsername) {
      console.log('Username required, showing confirmation dialog');
      setShowConfirmation(true);
    } else {
      // If username is not required, just close the modal
      console.log('Username not required, closing modal');
      setIsVisible(false);
    }
  };
  
  // Add keyboard event listener to close modal on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed, closing modal');
        if (showConfirmation) {
          // If confirmation dialog is open, just close it
          setShowConfirmation(false);
        } else {
          // Otherwise force close the modal and redirect
          console.log('Force closing modal via Escape key');
          setIsVisible(false);
          window.location.href = '/dashboard';
        }
      }
    };
    
    // Add event listener when modal is visible
    if (isVisible) {
      window.addEventListener('keydown', handleEscapeKey);
    }
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, showConfirmation]);
  
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
      
      // Show success message
      setSuccess('Username set successfully! Redirecting...');
      
      try {
        // Update the session to remove the needsUsername flag
        await update({
          ...session,
          user: {
            ...session.user,
            needsUsername: false,
            username: username,
          },
        });
      } catch (sessionError) {
        console.error("Error updating session:", sessionError);
        // Continue with redirect even if session update fails
      }
      
      // Mark username as set successfully - this will trigger the redirect effect
      setUsernameSet(true);
      
      // Add a shorter delay before closing the modal and redirecting to dashboard as a fallback
      setTimeout(() => {
        // Close the modal first
        setIsVisible(false);
        
        // Force a hard redirect to dashboard to ensure navigation happens
        window.location.href = '/dashboard';
      }, 1000); // Reduced to 1 second delay
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
            <h3 className="text-xl font-bold text-white mb-4">Choose an Option</h3>
            <p className="text-gray-300 mb-6">
              Setting a username is recommended for NiChat. What would you like to do?
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleCancelClose}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors"
              >
                Go back and set username
              </button>
              <button
                onClick={() => {
                  console.log('Force closing without sign out');
                  setShowConfirmation(false);
                  setIsVisible(false);
                  window.location.href = '/dashboard';
                }}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
              >
                Skip and continue to dashboard
              </button>
              <button
                onClick={handleConfirmClose}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
              >
                Sign out
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
          disabled={loading} // Only disable during loading, not during success
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
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-200 text-sm flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {success}
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
              disabled={loading || success !== ''}
            />
            <p className="mt-1 text-xs text-gray-400">
              Only letters, numbers, and underscores. 3-20 characters.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || success !== ''}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting Username...' : success ? 'Username Set!' : 'Continue'}
          </button>
          
          {/* Emergency bypass button - only shown after 5 seconds */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                console.log('Emergency bypass activated');
                setIsVisible(false);
                window.location.href = '/dashboard';
              }}
              className="text-xs text-gray-400 hover:text-primary underline"
            >
              Having trouble? Click here to bypass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
