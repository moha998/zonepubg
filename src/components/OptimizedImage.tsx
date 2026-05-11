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
  const [retryCount, setRetryCount] = useState(0);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
    setRetryCount(0);
  }, [src]);

  const processSrc = (url: string, retry: number = 0) => {
    if (!url) return url;
    
    // Process Pollinations URLs to improve relevance and stability
    if (url.includes('pollinations.ai')) {
      let finalUrl = url.replace('pollinations.ai/p/', 'image.pollinations.ai/prompt/');
      
      try {
        const urlObj = new URL(finalUrl);
        const prompt = urlObj.pathname.split('/prompt/')[1] || '';
        const decodedPrompt = decodeURIComponent(prompt).toLowerCase();
        
        // Base PUBG relevant prompts
        let newPrompt = 'PUBG-Mobile-Erangel-Battlefield-Realistic-4K';
        
        if (decodedPrompt.includes('m416') || decodedPrompt.includes('rifle') || decodedPrompt.includes('gun') || decodedPrompt.includes('weapon')) {
          newPrompt = 'PUBG-Mobile-M416-Glacier-Skin-Weapon';
        } else if (decodedPrompt.includes('awm') || decodedPrompt.includes('kar98') || decodedPrompt.includes('sniper')) {
          newPrompt = 'PUBG-Mobile-Sniper-Rifle-Scope';
        } else if (decodedPrompt.includes('robot') || decodedPrompt.includes('mech')) {
          newPrompt = 'PUBG-Mobile-Futuristic-Mecha-Robot';
        } else if (decodedPrompt.includes('drop') || decodedPrompt.includes('box') || decodedPrompt.includes('crate')) {
          newPrompt = 'PUBG-Mobile-Airdrop-Supply-Crate-Smoke';
        } else if (decodedPrompt.includes('trophy') || decodedPrompt.includes('winner') || decodedPrompt.includes('conqueror')) {
          newPrompt = 'PUBG-Mobile-Conqueror-Winner-Dinner-Trophy';
        } else if (decodedPrompt.includes('coins') || decodedPrompt.includes('uc')) {
          newPrompt = 'PUBG-Mobile-Gold-UC-Coins-Stacks';
        } else if (decodedPrompt.includes('skin') || decodedPrompt.includes('outfit')) {
          newPrompt = 'PUBG-Mobile-Legendary-Outfit-Skin';
        } else if (decodedPrompt.includes('vehicle') || decodedPrompt.includes('uaz') || decodedPrompt.includes('car')) {
          newPrompt = 'PUBG-Mobile-UAZ-Offroad-Vehicle';
        } else if (decodedPrompt.includes('map') || decodedPrompt.includes('erangel')) {
          newPrompt = 'PUBG-Mobile-Tactical-Map-Interface';
        }

        // Progressive Simplification Strategy
        if (retry === 1) {
          newPrompt = newPrompt.replace(/-Realistic-4K/g, '').replace(/-Skin/g, '');
        } else if (retry === 2) {
          if (newPrompt.includes('Weapon')) newPrompt = 'PUBG-Weapon';
          else if (newPrompt.includes('Sniper')) newPrompt = 'PUBG-Sniper';
          else if (newPrompt.includes('Battlefield')) newPrompt = 'PUBG-Battlefield';
          else newPrompt = 'PUBG-Mobile';
        } else if (retry >= 3) {
          newPrompt = 'battlefield-aesthetic';
        }

        const widthParam = urlObj.searchParams.get('width') || '800';
        const heightParam = urlObj.searchParams.get('height') || '450';
        
        // Final fallback if many retries fail
        if (retry >= 5) {
          return `https://picsum.photos/seed/pubg${widthParam}/800/450?grayscale`;
        }

        // Stable seed logic
        let seed = 'pubg_master';
        if (retry === 0) {
          const rawSeed = urlObj.searchParams.get('seed') || alt || '101';
          seed = rawSeed.replace(/[^0-9]/g, '').substring(0, 4) || '777';
        } else {
          const retrySeeds = ['888', '999', '111', '222', '333'];
          seed = retrySeeds[retry % retrySeeds.length];
        }
        
        const model = retry === 0 ? '&model=flux' : '';
        const encodedPrompt = encodeURIComponent(newPrompt.replace(/-/g, ' '));
        
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${widthParam}&height=${heightParam}&seed=${seed}&nologo=true${model}`;
      } catch (e) {
        return finalUrl;
      }
    }
    
    return url;
  };

  const finalSrc = processSrc(src, retryCount);

  return (
    <div 
      className={`relative overflow-hidden bg-[#1a1c23] flex items-center justify-center ${className}`}
      style={{ 
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* Main Image */}
      {finalSrc && !error ? (
        <img
          key={`${finalSrc}-${retryCount}`}
          src={finalSrc}
          alt={alt}
          onLoad={() => {
            setIsLoaded(true);
          }}
          onError={() => {
            if (retryCount < 5) {
              setRetryCount(prev => prev + 1);
            } else {
              console.error(`Failed to load image after all retries: ${finalSrc}`);
              setError(true);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-white/20 p-4">
           {/* Fallback Icon */}
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
           {alt && <span className="text-[10px] mt-2 text-center opacity-50">{alt}</span>}
        </div>
      )}

      {/* Loading (minimal) */}
      {!isLoaded && !error && finalSrc && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;
