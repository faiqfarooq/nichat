'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiUrl } from '@/lib/apiUtils';

export default function DebugUsernamePage() {
  const { data: session, update } = useSession();
  const [sessionData, setSessionData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUsername] = useState('');
  const [needsUsername, setNeedsUsername] = useState(false);
  
  // Fetch session data on mount
  useEffect(() => {
    fetchSessionData();
  }, []);
  
  // Update form values when user data changes
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setNeedsUsername(userData.needsUsername || false);
    }
  }, [userData]);
  
  const fetchSessionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(getApiUrl('/api/debug/session'), {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch session data');
      }
      
      setSessionData(data.session);
      setUserData(data.userData);
      
      console.log('Session data:', data);
    } catch (error) {
      console.error('Error fetching session data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch(getApiUrl('/api/debug/update-username-flag'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          needsUsername
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      setSuccess('User updated successfully');
      setUserData(data.user);
      
      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          needsUsername: data.user.needsUsername,
          username: data.user.username,
        },
      });
      
      // Refresh session data
      await fetchSessionData();
      
      console.log('User updated:', data);
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetUsername = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch(getApiUrl('/api/users/set-username'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set username');
      }
      
      setSuccess('Username set successfully via regular API');
      
      // Refresh session data
      await fetchSessionData();
      
      console.log('Username set:', data);
    } catch (error) {
      console.error('Error setting username:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Username Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Data */}
        <div className="bg-dark-lighter p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Session Data</h2>
          
          <button
            onClick={fetchSessionData}
            disabled={loading}
            className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Refresh Session Data'}
          </button>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {sessionData ? (
            <div className="bg-dark p-4 rounded overflow-auto max-h-80">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-400">No session data available</p>
          )}
        </div>
        
        {/* User Data */}
        <div className="bg-dark-lighter p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">User Data</h2>
          
          {userData ? (
            <div className="bg-dark p-4 rounded overflow-auto max-h-80">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-400">No user data available</p>
          )}
        </div>
      </div>
      
      {/* Update User Form */}
      <div className="mt-8 bg-dark-lighter p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Update User</h2>
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-200 text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
              placeholder="Enter username"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="needsUsername"
              checked={needsUsername}
              onChange={(e) => setNeedsUsername(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-700 rounded bg-dark"
            />
            <label htmlFor="needsUsername" className="ml-2 block text-sm text-gray-300">
              Needs Username
            </label>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition duration-200 disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Update User (Debug API)'}
            </button>
            
            <button
              type="button"
              onClick={handleSetUsername}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition duration-200 disabled:opacity-70"
            >
              {loading ? 'Setting...' : 'Set Username (Regular API)'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Test Modal Button */}
      <div className="mt-8 bg-dark-lighter p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Test Username Modal</h2>
        
        <p className="text-gray-300 mb-4">
          Click the button below to set the needsUsername flag to true and refresh the page. This will trigger the username setup modal to appear.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={async () => {
              try {
                setLoading(true);
                
                // Set needsUsername to true
                const response = await fetch(getApiUrl('/api/debug/update-username-flag'), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    needsUsername: true
                  }),
                  credentials: 'include'
                });
                
                if (!response.ok) {
                  const data = await response.json();
                  throw new Error(data.error || 'Failed to update user');
                }
                
                // Update session
                await update({
                  ...session,
                  user: {
                    ...session.user,
                    needsUsername: true,
                  },
                });
                
                // Redirect to dashboard to test modal
                window.location.href = '/dashboard';
              } catch (error) {
                console.error('Error:', error);
                setError(error.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded transition-colors disabled:opacity-70"
          >
            {loading ? 'Setting...' : 'Test Username Modal'}
          </button>
          
          <button
            onClick={async () => {
              try {
                setLoading(true);
                
                // Set needsUsername to false directly in the database
                const response = await fetch(getApiUrl('/api/debug/direct-db-update'), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: userData?.id,
                    needsUsername: false
                  })
                });
                
                if (!response.ok) {
                  const data = await response.json();
                  throw new Error(data.error || 'Failed to update user');
                }
                
                const data = await response.json();
                setSuccess('User updated directly in database: ' + data.message);
                
                // Refresh session data
                await fetchSessionData();
                
                // Update session
                await update({
                  ...session,
                  user: {
                    ...session.user,
                    needsUsername: false,
                  },
                });
              } catch (error) {
                console.error('Error:', error);
                setError(error.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !userData?.id}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Force Reset needsUsername Flag'}
          </button>
        </div>
      </div>
      
      {/* Direct Database Update */}
      <div className="mt-8 bg-dark-lighter p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Direct Database Update</h2>
        
        <p className="text-gray-300 mb-4">
          Use this form to directly update the user in the database, bypassing the session.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="directUserId" className="block text-sm font-medium text-gray-300 mb-1">
              User ID
            </label>
            <input
              type="text"
              id="directUserId"
              value={userData?.id || ''}
              readOnly
              className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');
                  setSuccess('');
                  
                  const response = await fetch(getApiUrl('/api/debug/direct-db-update'), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: userData?.id,
                      needsUsername: false
                    })
                  });
                  
                  const data = await response.json();
                  
                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to update user');
                  }
                  
                  setSuccess('User updated directly in database: ' + data.message);
                  
                  // Refresh session data
                  await fetchSessionData();
                } catch (error) {
                  console.error('Error:', error);
                  setError(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !userData?.id}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Set needsUsername = false'}
            </button>
            
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');
                  setSuccess('');
                  
                  const response = await fetch(getApiUrl('/api/debug/direct-db-update'), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: userData?.id,
                      needsUsername: true
                    })
                  });
                  
                  const data = await response.json();
                  
                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to update user');
                  }
                  
                  setSuccess('User updated directly in database: ' + data.message);
                  
                  // Refresh session data
                  await fetchSessionData();
                } catch (error) {
                  console.error('Error:', error);
                  setError(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !userData?.id}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Set needsUsername = true'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <div className="mt-8 flex space-x-4">
        <a
          href="/dashboard"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors"
        >
          Go to Dashboard
        </a>
        
        <a
          href="/"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
