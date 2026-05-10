'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'danger' | 'upcoming' | 'past' | 'draft'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-sun text-deep',
    success: 'bg-ok/20 text-ok border border-ok/30',
    danger: 'bg-danger/10 text-danger border border-danger/30',
    upcoming: 'bg-earth/15 text-earth border border-earth/30',
    past: 'bg-stone/30 text-dust border border-stone/50',
    draft: 'bg-sun/50 text-dust border border-stone/30',
  }

  return (
    <span
      className={`
        inline-flex items-center font-syne text-xs px-3 py-1 rounded-full
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
