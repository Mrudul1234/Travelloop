'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      className={`
        bg-sun border border-stone/40 rounded-2xl shadow-md
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
