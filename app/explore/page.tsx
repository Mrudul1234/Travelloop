'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Star, Compass, Filter, Grid, List as ListIcon, ChevronRight, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { ArchImage } from '@/components/ui/ArchImage'
import { Badge } from '@/components/ui/Badge'
import { JaliDivider } from '@/components/ui/JaliDivider'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'heritage', label: 'Heritage', icon: '🏯' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'spiritual', label: 'Spiritual', icon: '🕉' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'beaches', label: 'Beaches', icon: '🏖' },
]

export default function ExplorePage() {
  const supabase = createClient()
  const [destinations, setDestinations] = useState<any[]>([])
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [view, setView] = useState<'destinations' | 'trips'>('destinations')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // Fetch destinations from our new API
      const destRes = await fetch('/api/destinations')
      const destData = await destRes.json()
      
      // Fetch photos for each destination that doesn't have one
      const withPhotos = await Promise.all(destData.map(async (d: any) => {
        const photoRes = await fetch(`/api/photos?city=${encodeURIComponent(d.destination_name)}`)
        const photoData = await photoRes.json()
        return {
          ...d,
          cover_photo: photoData.photos?.[0]?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'
        }
      }))
      setDestinations(withPhotos)

      // Fetch public trips
      const { data } = await supabase
        .from('trips')
        .select('*, profiles(full_name, avatar_url)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      
      setTrips(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredDestinations = destinations.filter(d => {
    const matchesSearch = d.destination_name.toLowerCase().includes(search.toLowerCase()) || 
                         d.state.toLowerCase().includes(search.toLowerCase())
    const matchesCat = category === 'all' || d.trip_types?.some((t: string) => t.toLowerCase() === category.toLowerCase())
    return matchesSearch && matchesCat
  })

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <GrainOverlay />
        
        {/* Header */}
        <div className="relative bg-deep px-6 md:px-10 py-12 overflow-hidden">
          <MandalaWatermark size={300} opacity={0.06} color="#FCD594" className="right-4 top-1/2 -translate-y-1/2" />
          <div className="relative z-10 max-w-2xl">
            <p className="font-syne text-xs text-sun/50 uppercase tracking-widest mb-1">अन्वेषण</p>
            <h1 className="font-display text-4xl text-sand">Discover India</h1>
            <p className="font-dm-sans text-sand/50 text-sm mt-2">
              Browse {destinations.length}+ curated destinations from our heritage dataset or see community journeys.
            </p>
            
            <div className="mt-8 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations (e.g. Kerala, Jaipur...)"
                className="w-full bg-sand/10 border border-sand/20 rounded-2xl px-4 py-4 pl-12 font-dm-sans text-sm text-sand placeholder:text-sand/30 focus:outline-none focus:bg-sand/15 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8">
          {/* View Toggle & Categories */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex gap-1 bg-sun/20 p-1 rounded-xl border border-stone/20 w-fit">
              <button
                onClick={() => setView('destinations')}
                className={`px-4 py-2 rounded-lg font-syne text-[10px] uppercase tracking-wider transition-all ${
                  view === 'destinations' ? 'bg-earth text-sand shadow-sm' : 'text-deep/60 hover:text-deep'
                }`}
              >
                Curated Destinations
              </button>
              <button
                onClick={() => setView('trips')}
                className={`px-4 py-2 rounded-lg font-syne text-[10px] uppercase tracking-wider transition-all ${
                  view === 'trips' ? 'bg-earth text-sand shadow-sm' : 'text-deep/60 hover:text-deep'
                }`}
              >
                Community Trips
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full font-syne text-xs transition-all ${
                    category === cat.id
                      ? 'bg-sun text-deep shadow-sm'
                      : 'bg-white/40 text-deep/60 border border-stone/10 hover:bg-white/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <JaliDivider className="mb-10" />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] bg-sun/40 rounded-3xl animate-pulse" />
              ))
            ) : view === 'destinations' ? (
              filteredDestinations.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Compass size={48} className="mx-auto text-earth/20 mb-4" />
                  <p className="font-playfair text-2xl text-earth/50">No destinations found</p>
                </div>
              ) : (
                filteredDestinations.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-[420px] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <ArchImage
                        src={dest.cover_photo}
                        alt={dest.destination_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
                      
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <div className="bg-sand/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                          <span className="font-syne text-[9px] text-earth font-bold uppercase tracking-widest">{dest.state}</span>
                        </div>
                        <div className="bg-sun/90 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-deep shadow-lg">
                          <Heart size={18} />
                        </div>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8 text-sand">
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={12} className="text-sun fill-sun" />
                          <span className="font-syne text-[10px] text-sun font-bold uppercase tracking-widest">Top Rated · {dest.popularity_score}/10</span>
                        </div>
                        <h3 className="font-display text-3xl mb-1">{dest.destination_name}</h3>
                        <p className="font-dm-sans text-xs text-sand/60 line-clamp-2 mb-4">{dest.unique_experiences}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {dest.trip_types?.slice(0, 3).map((type: string) => (
                            <span key={type} className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-[9px] font-syne uppercase tracking-wider text-white/80 border border-white/10">
                              {type}
                            </span>
                          ))}
                        </div>

                        <Link href={`/trips/new?city=${dest.destination_name}`}>
                          <button className="w-full bg-sun hover:bg-sand text-deep font-syne font-bold text-[10px] uppercase tracking-widest py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn">
                            Plan Journey <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              // Community Trips View (Existing logic)
              filteredTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <Link href={`/trips/${trip.id}/view`}>
                    <div className="bg-sun/40 border border-stone/30 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                      <div className="relative">
                        <ArchImage
                          src={trip.cover_photo || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'}
                          alt={trip.name}
                          width={600}
                          height={240}
                          className="w-full"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="upcoming">Community</Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-earth/20 flex items-center justify-center overflow-hidden">
                            {trip.profiles?.avatar_url ? (
                              <img src={trip.profiles.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                              <User size={12} className="text-earth" />
                            )}
                          </div>
                          <span className="font-syne text-[10px] text-earth uppercase tracking-widest">
                            By {trip.profiles?.full_name || 'Traveller'}
                          </span>
                        </div>
                        
                        <h3 className="font-playfair text-xl text-deep font-bold leading-tight group-hover:text-earth transition-colors">
                          {trip.name}
                        </h3>
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone/20">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-sun fill-sun" />
                            <span className="font-syne text-[10px] text-deep font-bold">4.9</span>
                          </div>
                          <div className="flex items-center gap-1 text-dust">
                            <MapPin size={12} />
                            <span className="font-syne text-[10px] uppercase tracking-wide">3 Cities</span>
                          </div>
                          <div className="flex-1 text-right">
                            <span className="font-syne text-[10px] text-earth font-bold group-hover:underline underline-offset-4 flex items-center justify-end gap-1">
                              View Trip <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
