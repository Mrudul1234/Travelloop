'use client'

import { useState } from 'react'

interface ArchImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  overlay?: boolean
  overlayText?: string
  noArch?: boolean
}

export function ArchImage({
  src,
  alt,
  width = '100%',
  height = '100%',
  className = '',
  overlay = false,
  overlayText,
  noArch = false,
}: ArchImageProps) {
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const borderRadiusStyle = noArch ? 'inherit' : (
    typeof width === 'number' 
      ? `${width / 2}px ${width / 2}px 12px 12px`
      : '50% 50% 12px 12px'
  )

  const fallbackSrc = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'

  return (
    <div
      className={`relative overflow-hidden group bg-sun/10 ${className}`}
      style={{
        width,
        height,
        borderRadius: borderRadiusStyle,
      }}
    >
      {/* Loading Skeleton */}
      {loading && !hasError && (
        <div className="absolute inset-0 bg-sun/40 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-earth/20 border-t-earth animate-spin" />
        </div>
      )}

      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        onLoad={() => setLoading(false)}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100 group-hover:scale-110'} transition-transform duration-700`}
        style={{
          filter: 'saturate(1.05) sepia(0.05)',
        }}
        onError={() => {
          if (!hasError) {
            setHasError(true)
            setLoading(false)
          }
        }}
      />
      
      {/* Warm gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to top, rgba(74,47,33,0.75) 0%, rgba(74,47,33,0.1) 60%, transparent 100%)',
        }}
      />

      {overlay && overlayText && (
        <div className="absolute bottom-4 left-0 right-0 text-center px-4 z-20">
          <span className="font-display text-sand text-xl md:text-2xl leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {overlayText}
          </span>
        </div>
      )}
    </div>
  )
}
