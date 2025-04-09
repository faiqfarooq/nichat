'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/apiUtils';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setError('Verification token is missing');
        return;
      }
      
      try {
        // Use a try-catch block to handle potential fetch errors
        const response = await fetch(getApiUrl(`/api/auth/verify-email?token=${token}`), {
          // Add cache control to prevent caching issues
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        // Check if the response is a redirect
        if (response.redirected) {
          // If the API redirects, follow the redirect
          router.push(response.url);
          return;
        }
        
        // Try to parse the JSON response
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, it might be a redirect or other response type
          if (response.ok) {
            // If the response was successful but not JSON, consider it a success
            setStatus('success');
            setTimeout(() => {
              router.push('/login?verified=true');
            }, 3000);
          } else {
            throw new Error('Invalid response from server');
          }
          return;
        }
        
        // Handle normal JSON response
        if (!response.ok) {
          setStatus('error');
          setError(data.error || 'Failed to verify email');
          return;
        }
        
        setStatus('success');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        setError('An unexpected error occurred');
      }
    };
    
    verifyEmail();
  }, [token, router]);
  
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-dark-lighter p-8 rounded-lg shadow-lg border border-gray-700"
      >
        <div className="text-center mb-6">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Your Email</h2>
              <p className="text-gray-400">Please wait while we verify your email address...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400">Your email has been successfully verified. You will be redirected to the login page shortly.</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-red-400 mb-4">{error}</p>
              <p className="text-gray-400">The verification link may have expired or is invalid. Please try again or request a new verification link.</p>
            </>
          )}
        </div>
        
        <div className="flex justify-center mt-6">
          <Link 
            href="/login" 
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-dark font-semibold rounded-lg transition"
          >
            Go to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
