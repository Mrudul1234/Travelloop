'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit2, MapPin, Calendar, Wallet, Map, CheckSquare, BarChart2, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { JaliDivider } from '@/components/ui/JaliDivider'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, dateRange, daysBetween, tripStatus, getActivityIcon } from '@/lib/utils'
import { getFallbackPhoto } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TripViewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [trip, setTrip] = useState<any>(null)
  const [stops, setStops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (!tripData) { toast.error('Trip not found'); router.push('/trips'); return }
      setTrip(tripData)

      const { data: stopsData } = await supabase
        .from('stops')
        .select('*')
        .eq('trip_id', id)
        .order('position')
      setStops(stopsData || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <MandalaWatermark size={200} opacity={0.15} color="#724E43" animate />
      </div>
    )
  }

  const status = tripStatus(trip?.start_date, trip?.end_date)
  const days = daysBetween(trip?.start_date, trip?.end_date)

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <GrainOverlay />

        {/* Hero */}
        <div className="relative h-64 bg-deep overflow-hidden">
          <img
            src={trip?.cover_photo || getFallbackPhoto(trip?.name || '')}
            alt={trip?.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-transparent" />
          <MandalaWatermark size={300} opacity={0.06} color="#FCD594" className="right-0 top-0" />

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-sand/10 backdrop-blur flex items-center justify-center text-sand hover:bg-sand/20 transition-colors">
              <ArrowLeft size={16} />
            </button>
            <div>
              <Badge variant={status === 'ongoing' ? 'success' : status as any}>{status}</Badge>
              <h1 className="font-display text-3xl text-sand mt-2 leading-tight">{trip?.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-syne text-xs text-sand/60">
                  <Calendar size={11} className="inline mr-1" />
                  {dateRange(trip?.start_date, trip?.end_date)}
                </span>
                <span className="font-syne text-xs text-sun">{formatCurrency(trip?.total_budget)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 border-b border-stone/20">
          {[
            { href: `/trips/${id}/build`, icon: Map, label: 'Itinerary' },
            { href: `/trips/${id}/budget`, icon: BarChart2, label: 'Budget' },
            { href: `/trips/${id}/checklist`, icon: CheckSquare, label: 'Checklist' },
            { href: '#', icon: Share2, label: 'Share', onClick: () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') } },
          ].map(({ href, icon: Icon, label, onClick }) => (
            <Link key={label} href={href} onClick={onClick} className="flex flex-col items-center gap-1.5 py-4 hover:bg-sun/40 transition-colors">
              <Icon size={18} className="text-earth" />
              <span className="font-syne text-[10px] text-deep uppercase tracking-wide">{label}</span>
            </Link>
          ))}
        </div>

        <div className="px-6 md:px-10 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Days', value: days, icon: '🗓' },
              { label: 'Cities', value: stops.length, icon: '🏙' },
              { label: 'Budget', value: formatCurrency(trip?.total_budget), icon: '💰' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-sun border border-stone/20 rounded-2xl p-4 text-center">
                <p className="text-2xl mb-1">{icon}</p>
                <p className="font-display text-xl text-deep">{value}</p>
                <p className="font-syne text-xs text-dust uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          <JaliDivider />

          {/* Stops */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl text-deep">Stops</h2>
              <Link href={`/trips/${id}/build`} className="font-syne text-xs text-earth flex items-center gap-1">
                <Edit2 size={12} /> Edit
              </Link>
            </div>

            {stops.length === 0 ? (
              <div className="text-center py-8 bg-sun/20 rounded-2xl border border-stone/20">
                <MapPin size={28} className="mx-auto text-earth/30 mb-2" />
                <p className="font-dm-sans text-dust text-sm">No stops added yet</p>
                <Link href={`/trips/${id}/build`} className="inline-block mt-3 bg-earth text-sand font-syne text-xs px-4 py-2 rounded-full">
                  Build Itinerary
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stops.map((stop, i) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 bg-sun/50 border border-stone/20 rounded-2xl p-3"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getFallbackPhoto(stop.city_name)}
                        alt={stop.city_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair font-bold text-deep text-lg">{stop.city_name}</p>
                      <p className="font-syne text-xs text-dust mb-1" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {stop.city_name_hindi} · {stop.days} day{stop.days !== 1 ? 's' : ''}
                      </p>
                      <Badge variant="default" className="text-[10px] py-0">{i + 1} Stop</Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg text-earth block">₹{((trip.total_budget / stops.length) || 0).toLocaleString('en-IN')}</span>
                      <span className="font-syne text-[10px] text-dust uppercase tracking-wider">Est. Budget</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
