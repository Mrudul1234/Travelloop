'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, PlusCircle, Compass, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { useSidebar } from '@/components/layout/SidebarContext'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', hindi: 'होम' },
  { href: '/trips', icon: MapPin, label: 'My Trips', hindi: 'यात्राएं' },
  { href: '/trips/new', icon: PlusCircle, label: 'New Trip', hindi: 'नई यात्रा' },
  { href: '/explore', icon: Compass, label: 'Explore', hindi: 'खोजें' },
  { href: '/profile', icon: User, label: 'Profile', hindi: 'प्रोफाइल' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebar()

  const isActive = (href: string) => {
    if (href === '/trips') {
      return pathname === '/trips' || (pathname.startsWith('/trips/') && !pathname.startsWith('/trips/new'))
    }
    if (pathname === href) return true
    return pathname.startsWith(href + '/')
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-deep/95 glass-deep z-40 flex-col transition-all duration-300 ease-in-out hidden md:flex ${collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
    >
      <MandalaWatermark size={300} opacity={0.05} color="#FCD594" className="bottom-0 right-0" />

      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-earth/30 ${collapsed ? 'justify-center px-2' : ''
          }`}
      >
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
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center rounded-xl transition-all duration-300 ease-in-out ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-3 gap-3'
                } ${active
                  ? 'bg-sun text-deep shadow-lg shadow-sun/20'
                  : 'text-sand/60 hover:text-sand hover:bg-sand/5'
                }`}
            >
              <div className={`flex-shrink-0 p-1.5 rounded-lg ${active ? 'bg-deep/10' : ''}`}>
                <Icon size={20} className={active ? 'text-deep' : 'text-sun/70'} />
              </div>
              {!collapsed && (
                <span className="flex-1 min-w-0">
                  <span
                    className={`font-outfit text-[14px] font-bold block leading-none ${active ? 'text-deep' : 'text-sand'
                      }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`font-devanagari text-base mt-1 block ${active ? 'text-deep/80' : 'text-sun/60'
                      }`}
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
      <div className="absolute -right-4 top-20 z-50">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-8 h-8 rounded-full bg-sun text-deep border-2 border-deep shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-200"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
        </button>
      </div>
    </aside>
  )
}