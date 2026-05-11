'use client'

import { useEffect } from 'react'
import { useSidebar } from '@/components/layout/SidebarContext'

interface MainContentProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

/**
 * Wrapper for page content that dynamically adjusts left margin
 * based on sidebar collapsed state via CSS custom property.
 */
export function MainContent({ children, className = '', noPadding = false }: MainContentProps) {
  const { collapsed } = useSidebar()

  // Set a CSS custom property on :root so all MainContent instances respond
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', collapsed ? '72px' : '240px')
  }, [collapsed])

  return (
    <div
      className={`flex-1 main-content-area transition-[margin] duration-300 ease-in-out ${noPadding ? '' : 'pb-20 md:pb-0'} ${className}`}
    >
      {children}
    </div>
  )
}
