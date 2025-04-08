'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
      return;
    }
    
    // Optionally verify token validity with the server
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        
        if (!response.ok) {
          setTokenValid(false);
          setError('Invalid or expired reset token');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setTokenValid(false);
        setError('Error verifying reset token');
      }
    };
    
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-dark-lighter rounded-lg shadow-xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your new password below
          </p>
        </div>
        
        {!tokenValid ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-md"
          >
            <p className="text-center">
              {error || 'Invalid or expired reset token'}
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/forgot-password"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-dark font-medium rounded-md transition-colors"
              >
                Request New Reset Link
              </Link>
            </div>
          </motion.div>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/30 border border-green-500 text-green-200 p-4 rounded-md"
          >
            <p className="text-center">
              Your password has been successfully reset.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-dark font-medium rounded-md transition-colors"
              >
                Login with New Password
              </Link>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 rounded p-3 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-dark border border-gray-700 rounded-md focus:ring-primary focus:border-primary focus:outline-none text-white"
                placeholder="Enter your new password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-dark border border-gray-700 rounded-md focus:ring-primary focus:border-primary focus:outline-none text-white"
                placeholder="Confirm your new password"
              />
            </div>
            
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Reset Password'
                )}
              </motion.button>
            </div>
            
            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary-light transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
