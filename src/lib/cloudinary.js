/**
 * Cloudinary configuration and utility functions
 */

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string} The transformed image URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId) return '';
  
  // If the URL is already a full Cloudinary URL, return it
  if (publicId.includes('cloudinary.com')) {
    return publicId;
  }
  
  // Default transformations
  const defaultOptions = {
    width: options.width || 'auto',
    height: options.height || 'auto',
    crop: options.crop || 'fill',
    gravity: options.gravity || 'faces',
    quality: options.quality || 'auto',
    fetchFormat: options.fetchFormat || 'auto',
  };
  
  // Build transformation string
  const transformations = Object.entries(defaultOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  // Return the URL
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Extract the public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string} The public ID
 */
export function getPublicIdFromUrl(url) {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Extract the public ID from the URL
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1 || uploadIndex === parts.length - 1) {
    return '';
  }
  
  // Return everything after 'upload/'
  return parts.slice(uploadIndex + 1).join('/');
}
