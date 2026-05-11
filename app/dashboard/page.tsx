'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlusCircle, MapPin, Compass, TrendingUp, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { MainContent } from '@/components/layout/MainContent'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { ArchImage } from '@/components/ui/ArchImage'
import { JaliDivider } from '@/components/ui/JaliDivider'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, dateRange, daysBetween, getGreetingTime, tripStatus } from '@/lib/utils'
import { getFallbackPhoto } from '@/lib/api'
import { getCityPhoto } from '@/lib/photos'

const INSPIRATION = [
  { city: 'Jaipur', tag: 'Rajasthan', photo: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { city: 'Varanasi', tag: 'Spiritual', photo: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&q=80' },
  { city: 'Goa', tag: 'Beaches', photo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
  { city: 'Leh', tag: 'Mountains', photo: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=400&q=80' },
  { city: 'Kerala', tag: 'Backwaters', photo: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80' },
  { city: 'Hampi', tag: 'Heritage', photo: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80' },
]

export default function DashboardPage() {
  const supabase = createClient()
  const [userName, setUserName] = useState('Traveller')
  const [trips, setTrips] = useState<any[]>([])
  const [ongoingTrip, setOngoingTrip] = useState<any>(null)
  const [inspiration, setInspiration] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth'; return }

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setUserName(profile?.full_name || user.email?.split('@')[0] || 'Traveller')

      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4)

      setTrips(tripsData || [])
      
      const ongoing = tripsData?.find(t => tripStatus(t.start_date, t.end_date) === 'ongoing')
      setOngoingTrip(ongoing || null)
      
      // Load inspiration from dataset — use INSPIRATION fallback immediately, then try to load from API
      try {
        const destRes = await fetch('/api/destinations')
        const destData = await destRes.json()
        if (Array.isArray(destData) && destData.length > 0) {
          // Shuffle and pick 6 — assign photos from local map (no API waterfall)
          const shuffled = [...destData].sort(() => 0.5 - Math.random()).slice(0, 6)
          setInspiration(shuffled.map((d: any) => ({
            city: d.destination_name,
            tag: d.state,
            photo: getCityPhoto(d.destination_name, d.state)
          })))
        } else {
          setInspiration(INSPIRATION)
        }
      } catch {
        setInspiration(INSPIRATION)
      }
      
      setLoading(false)
    }
    load()
  }, [])

  const greeting = getGreetingTime()

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <MainContent>
        <GrainOverlay />

        {/* Hero section */}
        <div className="relative bg-deep px-6 md:px-10 py-12 overflow-hidden transition-all duration-300 ease-in-out">
          {/* Dynamic Hero Background */}
          {ongoingTrip && (
            <div className="absolute inset-0 z-0">
              <img 
                src={ongoingTrip.cover_photo} 
                className="w-full h-full object-cover object-center opacity-30 scale-105 animate-soft-zoom" 
                alt="Current Trip"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-deep/20 via-deep to-deep" />
            </div>
          )}
          
          <MandalaWatermark size={500} opacity={0.07} color="#FCD594" animate className="right-0 top-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            {ongoingTrip && (
              <Badge variant="success" className="mb-3 animate-pulse">Ongoing Trip: {ongoingTrip.name}</Badge>
            )}
            <p
              className="font-syne text-lg text-sun/80 font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              {greeting}
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-sand leading-[1.1]">
              Welcome, <span className="text-sun">{userName}</span>
            </h1>
            <p className="font-dm-sans text-sand/50 text-xs md:text-sm mt-2">Your next adventure awaits. Chalo plan karte hain!</p>

            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 mt-6 bg-sun hover:bg-stone text-deep font-syne font-bold text-xs px-8 py-3.5 rounded-full shadow-lg shadow-sun/20 transition-all hover:scale-[1.03]"
            >
              <PlusCircle size={15} />
              Plan New Trip
            </Link>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 space-y-10">
          {/* Recent trips */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-2xl text-deep">Recent Trips</h2>
              <Link href="/trips" className="font-syne text-xs text-earth hover:text-deep transition-colors uppercase tracking-wide">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => <div key={i} className="h-48 bg-sun/40 rounded-2xl animate-pulse" />)}
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12 bg-sun/20 rounded-2xl border border-stone/20">
                <MapPin size={36} className="mx-auto text-earth/30 mb-3" />
                <p className="font-playfair text-xl text-earth/50">No trips yet</p>
                <p className="font-dm-sans text-dust text-sm mt-1">Start planning your first Indian adventure!</p>
                <Link href="/trips/new" className="inline-block mt-4 bg-earth text-sand font-syne text-xs px-5 py-2.5 rounded-full">
                  Plan a Trip
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map((trip, i) => {
                  const status = tripStatus(trip.start_date, trip.end_date)
                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link href={`/trips/${trip.id}/view`}>
                        <div className="bg-sun border border-stone/30 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                          <ArchImage
                            src={trip.cover_photo || getFallbackPhoto(trip.name)}
                            alt={trip.name}
                            width={600}
                            height={180}
                            className="w-full"
                          />
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <h3 className="font-playfair font-bold text-deep text-base leading-tight">{trip.name}</h3>
                              <Badge variant={status === 'upcoming' ? 'upcoming' : status === 'ongoing' ? 'success' : status === 'past' ? 'past' : 'draft'}>
                                {status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 font-syne text-xs text-dust">
                                <Calendar size={11} /> {dateRange(trip.start_date, trip.end_date)}
                              </span>
                              <span className="font-syne text-xs text-earth font-medium">{formatCurrency(trip.total_budget)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </section>

          <JaliDivider />

          {/* Inspiration grid */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-2xl text-deep">Inspire Me</h2>
              <Link href="/explore" className="font-syne text-xs text-earth hover:text-deep transition-colors uppercase tracking-wide">
                Explore all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {inspiration.map(({ city, tag, photo }, i) => (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/trips/new?city=${encodeURIComponent(city)}`}>
                    <div className="relative overflow-hidden rounded-2xl group cursor-pointer h-36">
                      <ArchImage
                        src={photo}
                        alt={city}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                        noArch
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-3">
                        <p className="font-playfair font-bold text-sand text-sm">{city}</p>
                        <p className="font-syne text-[10px] text-sand/60 uppercase tracking-wide">{tag}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </MainContent>
      <BottomNav />
    </div>
  )
}
