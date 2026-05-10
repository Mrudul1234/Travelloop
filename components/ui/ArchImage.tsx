'use client'

interface ArchImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  overlay?: boolean
  overlayText?: string
}

export function ArchImage({
  src,
  alt,
  width = '100%',
  height = '100%',
  className = '',
  overlay = false,
  overlayText,
}: ArchImageProps) {
  const borderRadiusStyle = typeof width === 'number' 
    ? `${width / 2}px ${width / 2}px 12px 12px`
    : '50% 50% 12px 12px'

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius: borderRadiusStyle,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          filter: 'saturate(1.1) sepia(0.08)',
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = `https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=${width}&h=${height}&fit=crop`
        }}
      />
      {/* Warm gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(74,47,33,0.7) 0%, rgba(74,47,33,0.1) 50%, transparent 100%)',
        }}
      />
      {overlay && overlayText && (
        <div className="absolute bottom-3 left-0 right-0 text-center px-2">
          <span className="font-display text-sand text-lg leading-tight">{overlayText}</span>
        </div>
      )}
    </div>
  )
}
