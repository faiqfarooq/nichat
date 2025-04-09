'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { createContext, useContext, useState, useCallback } from 'react';
import { cloudinaryConfig } from '@/lib/cloudinary';
import { getApiUrl } from '@/lib/apiUtils';

// Create a context for Cloudinary
const CloudinaryContext = createContext();

/**
 * Cloudinary Provider Component
 * Provides Cloudinary configuration and upload widget to the application
 */
export function CloudinaryProvider({ children }) {
  return (
    <CloudinaryContext.Provider value={cloudinaryConfig}>
      {children}
    </CloudinaryContext.Provider>
  );
}

/**
 * Custom hook to use Cloudinary context
 * @returns {Object} Cloudinary configuration
 */
export function useCloudinary() {
  const context = useContext(CloudinaryContext);
  
  if (context === undefined) {
    throw new Error('useCloudinary must be used within a CloudinaryProvider');
  }
  
  return context;
}

/**
 * Cloudinary Upload Button Component
 * A reusable component for uploading images to Cloudinary
 */
export function CloudinaryUploadButton({ onUpload, children, className, options = {} }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get signature for secure uploads
  const getSignature = useCallback(async (callback, params) => {
    try {
      setIsLoading(true);
      
      // For development, use unsigned upload if API key is not set
      if (process.env.NODE_ENV !== 'production' || 
          !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
          !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        console.log('Using unsigned upload (development mode or missing env vars)');
        callback({
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
        });
        return;
      }
      
      const response = await fetch(getApiUrl('/api/cloudinary/signature'));
      
      if (!response.ok) {
        throw new Error('Failed to get upload signature');
      }
      
      const data = await response.json();
      
      callback({
        signature: data.signature,
        apiKey: data.apiKey,
        cloudName: data.cloudName,
        timestamp: data.timestamp,
        uploadPreset: data.uploadPreset,
      });
    } catch (error) {
      console.error('Error getting signature:', error);
      // Continue without signature (will use unsigned upload)
      callback({
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Default options
  const defaultOptions = {
    maxFiles: 1,
    resourceType: 'image',
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
    maxImageFileSize: 2000000, // 2MB
    ...options,
  };
  
  // Handle upload success
  const handleSuccess = (result) => {
    if (result.info && result.info.secure_url) {
      onUpload(result.info.secure_url);
    }
  };
  
  // For development, we'll use a simpler approach
  if (process.env.NODE_ENV !== 'production' || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    
    // In development, use a file input instead of Cloudinary widget
    return (
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            // Create a local URL for the file
            const localUrl = URL.createObjectURL(file);
            
            // Call the onUpload callback with the local URL
            onUpload(localUrl);
          }}
          className="hidden"
          id="local-file-upload"
        />
        <label
          htmlFor="local-file-upload"
          className={className}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : children}
        </label>
      </div>
    );
  }

  // In production, use the Cloudinary widget
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={handleSuccess}
      options={defaultOptions}
      signatureEndpoint={getSignature}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className={className}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : children}
        </button>
      )}
    </CldUploadWidget>
  );
}
