'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, PlusCircle, Compass, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/trips', icon: MapPin, label: 'Trips' },
  { href: '/trips/new', icon: PlusCircle, label: 'New' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/trips') {
      return pathname === '/trips' || (pathname.startsWith('/trips/') && !pathname.startsWith('/trips/new'))
    }
    if (pathname === href) return true
    return pathname.startsWith(href + '/')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-deep/90 glass-deep border-t border-earth/20 flex md:hidden z-40 px-2 pb-safe">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all duration-300 ${
              active ? 'text-sun scale-110' : 'text-stone/60 hover:text-sand'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all ${active ? 'bg-earth/40 shadow-[0_0_10px_rgba(252,213,148,0.2)]' : ''}`}>
              <Icon size={22} />
            </div>
            <span className={`font-outfit text-[10px] font-bold tracking-tight ${active ? 'text-sun opacity-100' : 'opacity-60'}`}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
