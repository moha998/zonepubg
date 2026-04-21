import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * OptimizedImage Component
 * Features:
 * - Lazy Loading (via native loading="lazy")
 * - CSS Fade-in Animation (lighter than framer-motion)
 * - Layout Shift Prevention
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  aspectRatio,
  priority = false,
  objectFit = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden bg-white/5 flex items-center justify-center ${className}`}
      style={{ 
        aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* Main Image */}
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full absolute inset-0 text-transparent transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${
            objectFit === 'cover' ? 'object-cover' : 
            objectFit === 'contain' ? 'object-contain' : 
            'object-fill'
          }`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 p-4">
           {/* Fallback Icon */}
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
           <span className="text-[10px] font-bold mt-2 text-center break-words max-w-full truncate">{alt || "لا توجد صورة"}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {!isLoaded && !error && src && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
