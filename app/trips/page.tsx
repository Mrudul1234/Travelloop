'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, MapPin, Calendar, Wallet, ChevronRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { ArchImage } from '@/components/ui/ArchImage'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, dateRange, daysBetween, tripStatus } from '@/lib/utils'
import { getFallbackPhoto } from '@/lib/api'

export default function TripsPage() {
  const supabase = createClient()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'draft'>('all')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth'; return }
      const { data } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTrips(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) return
    
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete trip')
    } else {
      setTrips(trips.filter(t => t.id !== id))
      toast.success('Trip deleted! 🗑️')
    }
  }

  const filtered = trips.filter(t => {
    if (filter === 'all') return true
    return tripStatus(t.start_date, t.end_date) === filter
  })

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <GrainOverlay />

        {/* Header */}
        <div className="relative bg-deep px-6 md:px-10 py-8 overflow-hidden">
          <MandalaWatermark size={300} opacity={0.06} color="#FCD594" className="right-4 top-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="font-syne text-xs text-sun/50 uppercase tracking-widest mb-1">मेरी यात्राएं</p>
              <h1 className="font-display text-3xl text-sand">My Trips</h1>
            </div>
            <Link href="/trips/new" className="flex items-center gap-2 bg-sun hover:bg-stone text-deep font-syne font-bold text-xs px-5 py-2.5 rounded-full transition-all">
              <Plus size={14} /> New Trip
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-6 md:px-10 py-4 flex gap-2 overflow-x-auto scrollbar-none">
          {(['all', 'upcoming', 'ongoing', 'past', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-shrink-0 font-syne text-xs px-4 py-1.5 rounded-full transition-all capitalize ${
                filter === f
                  ? 'bg-earth text-sand'
                  : 'bg-sun/40 text-deep border border-stone/20 hover:bg-sun/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="px-6 md:px-10 py-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-56 bg-sun/40 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <MapPin size={40} className="mx-auto text-earth/30 mb-4" />
              <p className="font-playfair text-xl text-earth/50">No trips yet</p>
              <p className="font-dm-sans text-dust text-sm mt-2">Create your first trip to get started</p>
              <Link href="/trips/new" className="inline-block mt-5 bg-earth text-sand font-syne text-xs px-6 py-3 rounded-full">
                Plan Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((trip, i) => {
                const status = tripStatus(trip.start_date, trip.end_date)
                const days = daysBetween(trip.start_date, trip.end_date)
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/trips/${trip.id}/view`}>
                      <div className="bg-sun border border-stone/30 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                        <ArchImage
                          src={trip.cover_photo || getFallbackPhoto(trip.name)}
                          alt={trip.name}
                          width={600}
                          height={180}
                          className="w-full"
                        />
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-playfair font-bold text-deep text-base leading-tight">{trip.name}</h3>
                            <Badge variant={status === 'upcoming' ? 'upcoming' : status === 'ongoing' ? 'success' : status === 'past' ? 'past' : 'draft'}>
                              {status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-dust font-syne">
                              <Calendar size={11} /> {dateRange(trip.start_date, trip.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-stone/20">
                            <span className="font-syne text-xs text-dust">{days} days</span>
                            <span className="font-display text-sm text-earth font-semibold">{formatCurrency(trip.total_budget)}</span>
                          </div>
                        </div>
                        <div className="px-4 pb-4 flex justify-between items-center">
                          <button 
                            onClick={(e) => handleDelete(e, trip.id)}
                            className="w-8 h-8 rounded-full bg-danger/10 text-danger hover:bg-danger hover:text-sand transition-all flex items-center justify-center"
                          >
                            <Trash2 size={14} />
                          </button>
                          <span className="font-syne text-[10px] text-earth uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all">
                            View Trip <ChevronRight size={10} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
