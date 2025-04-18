'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SimpleLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-dark-lighter rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {/* Direct form submission to NextAuth */}
      <form 
        method="post" 
        action="/api/auth/callback/credentials?redirect=/dashboard"
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-dark transition">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition duration-200"
        >
          Login
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="text-primary hover:text-primary-dark transition">
          Register
        </Link>
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-lighter text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <a
            href="/api/auth/signin/google?callbackUrl=/dashboard"
            className="w-full flex items-center justify-center py-2 px-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
}
