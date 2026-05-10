'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-syne font-medium transition-all duration-150 cursor-pointer select-none rounded-full'

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variants = {
    primary: 'bg-earth text-sand hover:bg-deep active:scale-[0.98] shadow-sm hover:shadow-md',
    secondary:
      'border-2 border-earth text-earth bg-transparent hover:bg-earth/10 active:scale-[0.98]',
    ghost: 'text-earth hover:bg-earth/10 active:scale-[0.98]',
    danger: 'bg-danger text-sand hover:bg-danger/90 active:scale-[0.98]',
  }

  return (
    <button
      className={`
        ${base}
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}
