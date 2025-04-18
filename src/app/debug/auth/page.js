"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [serverSession, setServerSession] = useState(null);
  const [authCheck, setAuthCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch debug data
  useEffect(() => {
    async function fetchDebugData() {
      try {
        setLoading(true);
        
        // Fetch session data from server
        const sessionRes = await fetch("/api/debug/session");
        const sessionData = await sessionRes.json();
        
        // Fetch auth check data
        const authCheckRes = await fetch("/api/debug/auth-check");
        const authCheckData = await authCheckRes.json();
        
        setServerSession(sessionData);
        setAuthCheck(authCheckData);
      } catch (err) {
        console.error("Error fetching debug data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDebugData();
  }, []);

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Authentication Debug</h1>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-primary text-dark rounded-md hover:bg-primary-dark transition-colors"
          >
            Back to Dashboard
          </Link>
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
            </div>
            
            {/* Server-side Session Status */}
            <div className="bg-dark-lighter rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Server-side Session Status</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Session Exists</p>
                  <p className="text-white font-medium">
                    {serverSession?.session ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </p>
                </div>
                
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">DB Connection</p>
                  <p className="text-white font-medium">
                    {serverSession?.dbConnectionStatus === "Connected" ? (
                      <span className="text-green-400">Connected</span>
                    ) : (
                      <span className="text-red-400">{serverSession?.dbConnectionStatus || "Error"}</span>
                    )}
                  </p>
                </div>
              </div>
              
              {serverSession?.session && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">Session Data</h3>
                  <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                    {JSON.stringify(serverSession.session, null, 2)}
                  </pre>
                </div>
              )}
              
              {serverSession?.userData && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">User Data from DB</h3>
                  <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                    {JSON.stringify(serverSession.userData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Auth Check Results */}
            <div className="bg-dark-lighter rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Auth Check Results</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Authenticated</p>
                  <p className="text-white font-medium">
                    {authCheck?.authenticated ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </p>
                </div>
                
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Token Exists</p>
                  <p className="text-white font-medium">
                    {authCheck?.tokenExists ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </p>
                </div>
                
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Session Cookie</p>
                  <p className="text-white font-medium">
                    {authCheck?.hasSessionCookie ? (
                      <span className="text-green-400">Present</span>
                    ) : (
                      <span className="text-red-400">Missing</span>
                    )}
                  </p>
                </div>
                
                <div className="bg-dark p-3 rounded border border-gray-700">
                  <p className="text-gray-400 text-sm">Environment</p>
                  <p className="text-white font-medium">
                    {authCheck?.environment}
                  </p>
                </div>
              </div>
              
              {authCheck?.cookieKeys?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">Cookie Keys</h3>
                  <div className="bg-dark p-3 rounded border border-gray-700">
                    <ul className="list-disc list-inside text-gray-300">
                      {authCheck.cookieKeys.map((key, index) => (
                        <li key={index}>{key}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {authCheck?.tokenData && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">Token Data</h3>
                  <pre className="bg-dark p-3 rounded border border-gray-700 overflow-auto text-sm text-gray-300">
                    {JSON.stringify(authCheck.tokenData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="bg-dark-lighter rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/api/auth/signout"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </Link>
                
                <Link 
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </Link>
                
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
                    
                    // Reload the page
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Clear Storage & Reload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
