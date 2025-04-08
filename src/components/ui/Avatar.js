'use client';

/**
 * Avatar Component
 * 
 * A reusable component for displaying user avatars with fallback to initials
 * when no image is available.
 */
export default function Avatar({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  className = '',
  onClick = null,
}) {
  // Define size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl',
  };
  
  // Get the size class or default to md
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Get the first letter of the name for the fallback
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  // Handle image load error
  const handleError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };
  
  return (
    <div 
      className={`relative rounded-full overflow-hidden ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleError}
          />
          <div 
            className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
            style={{ display: 'none' }}
          >
            {initial}
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
          {initial}
        </div>
      )}
    </div>
  );
}
