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
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-deep border-t border-earth/30 flex md:hidden z-40">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 gap-1 transition-colors ${
              active ? 'text-sun' : 'text-stone'
            }`}
          >
            <Icon size={20} />
            <span className="font-syne text-[10px]">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
