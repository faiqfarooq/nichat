"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearAuthData } from "@/lib/authUtils";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies, setCookies] = useState([]);

  // Fetch test data
  useEffect(() => {
    async function fetchTestData() {
      try {
        setLoading(true);
        
        // Get cookies
        const cookieObj = {};
        document.cookie.split(';').forEach(cookie => {
          const [name, value] = cookie.trim().split('=');
          if (name) {
            cookieObj[name] = '***MASKED***';
          }
        });
        setCookies(cookieObj);
        
        // Fetch auth test data
        const response = await fetch("/api/debug/test-auth");
        
        if (!response.ok) {
          throw new Error(`Error fetching test data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTestResults(data);
      } catch (err) {
        console.error("Error in auth test:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTestData();
  }, []);

  // Function to handle sign out and clear storage
  const handleSignOut = async () => {
    try {
      // Clear all auth data
      clearAuthData();
      
      // Sign out
      await signOut({ redirect: false });
      
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Authentication Test</h1>
          <div className="flex space-x-3">
            <Link 
              href="/debug/auth" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Auth Debug
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-primary text-dark rounded-md hover:bg-primary-dark transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Client-side Session Status */}
            <div className="bg-dark-lighter rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Client-side Session Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-medium">
                    {status === "authenticated" ? (
                      <span className="text-green-400">Authenticated</span>
                    ) : status === "loading" ? (
                      <span className="text-yellow-400">Loading</span>
                    ) : (
                      <span className="text-red-400">Unauthenticated</span>
                    )}
                  </p>
                </div>
                
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Session Exists</p>
                  <p className="text-white font-medium">
                    {session ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </p>
                </div>
              </div>
              
              {session && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">Session Data</h3>
                  <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Client-side Cookies</h3>
                <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                  {JSON.stringify(cookies, null, 2)}
                </pre>
              </div>
            </div>
            
            {/* Server-side Test Results */}
            {testResults && (
              <div className="bg-dark-lighter rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Server-side Test Results</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark p-3 rounded border border-gray-700">
                    <p className="text-gray-400 text-sm">Session Exists</p>
                    <p className="text-white font-medium">
                      {testResults.sessionExists ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-gray-700">
                    <p className="text-gray-400 text-sm">Token Exists</p>
                    <p className="text-white font-medium">
                      {testResults.tokenExists ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-gray-700">
                    <p className="text-gray-400 text-sm">Environment</p>
                    <p className="text-white font-medium">
                      {testResults.environment}
                    </p>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-gray-700">
                    <p className="text-gray-400 text-sm">Server Time</p>
                    <p className="text-white font-medium">
                      {new Date(testResults.serverTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {testResults.sessionData && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Session Data</h3>
                    <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                      {JSON.stringify(testResults.sessionData, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.tokenData && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Token Data</h3>
                    <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                      {JSON.stringify(testResults.tokenData, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.routeTests && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Route Protection Tests</h3>
                    <div className="bg-dark p-3 rounded border border-gray-700 overflow-auto">
                      <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                          <tr>
                            <th className="py-2 px-4">Route</th>
                            <th className="py-2 px-4">Is Protected</th>
                            <th className="py-2 px-4">Skip Auth</th>
                            <th className="py-2 px-4">Protected?</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testResults.routeTests.map((test, index) => (
                            <tr key={index} className="border-b border-gray-800">
                              <td className="py-2 px-4 font-medium">{test.route}</td>
                              <td className="py-2 px-4">
                                {test.isProtected ? (
                                  <span className="text-green-400">Yes</span>
                                ) : (
                                  <span className="text-red-400">No</span>
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {test.shouldSkipAuth ? (
                                  <span className="text-green-400">Yes</span>
                                ) : (
                                  <span className="text-red-400">No</span>
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {test.wouldBeProtected ? (
                                  <span className="text-green-400">Yes</span>
                                ) : (
                                  <span className="text-red-400">No</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="bg-dark-lighter rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
              
              <div className="flex flex-wrap gap-4">
                {status === "authenticated" ? (
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Sign Out (with cleanup)
                  </button>
                ) : (
                  <button
                    onClick={() => signIn(null, { callbackUrl: '/dashboard' })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                )}
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
                
                <button
                  onClick={() => {
                    // Clear browser storage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Clear cookies
                    document.cookie.split(';').forEach(cookie => {
                      const [name] = cookie.trim().split('=');
                      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    });
                    
                    // Reload the page
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Clear Storage & Cookies
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
