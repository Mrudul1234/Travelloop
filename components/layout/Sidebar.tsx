'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, PlusCircle, Compass, User, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', hindi: 'होम' },
  { href: '/trips', icon: MapPin, label: 'My Trips', hindi: 'यात्राएं' },
  { href: '/trips/new', icon: PlusCircle, label: 'New Trip', hindi: 'नई यात्रा' },
  { href: '/explore', icon: Compass, label: 'Explore', hindi: 'खोजें' },
  { href: '/profile', icon: User, label: 'Profile', hindi: 'प्रोफाइल' },
]



export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-deep/95 glass-deep z-40 flex flex-col transition-all duration-300 hidden md:flex ${collapsed ? 'w-16' : 'w-[240px]'}`}
    >
      <MandalaWatermark size={300} opacity={0.05} color="#FCD594" className="bottom-0 right-0" />

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-earth/30 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-sun flex-shrink-0 flex items-center justify-center">
          <span className="text-deep text-xs font-syne font-black">T</span>
        </div>
        {!collapsed && (
          <span className="font-syne font-bold text-sand text-sm tracking-widest">TRAVELOOP</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 relative z-10">
        {NAV_ITEMS.map(({ href, icon: Icon, label, hindi }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                active 
                  ? 'bg-sun text-deep shadow-lg shadow-sun/20 translate-x-1' 
                  : 'text-sand/60 hover:text-sand hover:bg-sand/5'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${active ? 'bg-deep/10' : ''}`}>
                <Icon size={22} className={active ? 'text-deep' : 'text-sun/70'} />
              </div>
              {!collapsed && (
                <span className="flex-1 min-w-0">
                  <span className={`font-outfit text-[15px] font-bold block leading-none ${active ? 'text-deep' : 'text-sand'}`}>{label}</span>
                  <span
                    className={`text-[15px] font-devanagari mt-1 block ${active ? 'text-deep/70' : 'text-sun/50'}`}
                  >
                    {hindi}
                  </span>
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="relative z-10 mx-auto mb-4 w-9 h-9 rounded-full bg-earth/30 hover:bg-earth/50 flex items-center justify-center text-stone hover:text-sand transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  )
}
