'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Sparkles, GripVertical, Loader2, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { Badge } from '@/components/ui/Badge'
import { getActivityTypeLabel, getActivityIcon } from '@/lib/utils'
import { generateItinerary, getFallbackPhoto } from '@/lib/api'
import { ArchImage } from '@/components/ui/ArchImage'
import toast from 'react-hot-toast'

export default function TripBuildPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [trip, setTrip] = useState<any>(null)
  const [stops, setStops] = useState<any[]>([])
  const [activities, setActivities] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeStop, setActiveStop] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', id).eq('user_id', user.id).single()
      if (!tripData) { toast.error('Trip not found'); router.push('/trips'); return }
      setTrip(tripData)

      const { data: stopsData } = await supabase.from('stops').select('*').eq('trip_id', id).order('position')
      const stopsArr = stopsData || []
      setStops(stopsArr)
      if (stopsArr.length > 0) setActiveStop(stopsArr[0].id)

      // Load activities for all stops in one go
      const stopIds = stopsArr.map(s => s.id)
      const { data: allActivities } = await supabase
        .from('activities')
        .select('*')
        .in('stop_id', stopIds)
        .order('day_number, time')
      
      const activitiesMap: Record<string, any[]> = {}
      stopsArr.forEach(stop => {
        activitiesMap[stop.id] = (allActivities || []).filter(a => a.stop_id === stop.id)
      })
      setActivities(activitiesMap)
      setLoading(false)
    }
    load()
  }, [id])

  const handleAIGenerate = async () => {
    if (!trip) return
    setGenerating(true)
    try {
      const result = await generateItinerary(
        stops.map(s => s.city_name),
        trip.start_date,
        trip.end_date,
        trip.total_budget
      )
      if (!result || !result.stops) { toast.error('AI generation failed'); return }

      // Save AI activities to db
      const newActivities: Record<string, any[]> = {}
      for (let i = 0; i < stops.length && i < result.stops.length; i++) {
        const stop = stops[i]
        const gen = result.stops[i]
        if (!gen?.activities) continue

        // Delete existing
        await supabase.from('activities').delete().eq('stop_id', stop.id)

        const toInsert = gen.activities.map((act: any, j: number) => ({
          stop_id: stop.id,
          trip_id: id,
          name: act.name,
          name_hindi: act.nameHindi || act.name,
          type: act.type || 'sightseeing',
          time: act.time || '09:00',
          duration_min: act.durationMin || 60,
          cost_inr: act.costInr || 0,
          description: act.description || '',
          day_number: Math.floor(j / 3) + 1,
          position: j,
        }))

        const { data: saved, error: insertError } = await supabase.from('activities').insert(toInsert).select()
        if (insertError) {
          console.error('Database Insert Error:', insertError)
          throw new Error(`${insertError.message} (Stop: ${stop.city_name})`)
        }
        newActivities[stop.id] = saved || []
      }
      setActivities(newActivities)
      toast.success('AI itinerary generated! 🎉')
    } catch (err: any) {
      console.error('Generation Flow Error:', err)
      toast.error(err.message || 'Generation failed', { duration: 5000 })
    } finally {
      setGenerating(false)
    }
  }

  const deleteActivity = async (stopId: string, actId: string) => {
    await supabase.from('activities').delete().eq('id', actId)
    setActivities(prev => ({
      ...prev,
      [stopId]: prev[stopId].filter(a => a.id !== actId),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <MandalaWatermark size={200} opacity={0.15} color="#724E43" animate />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <GrainOverlay />

        {/* Header */}
        <div className="relative bg-deep px-6 md:px-10 py-6 overflow-hidden">
          <MandalaWatermark size={250} opacity={0.06} color="#FCD594" className="right-4 top-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-sand/10 flex items-center justify-center text-sand hover:bg-sand/20 transition-colors">
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="font-syne text-xs text-sun/50 uppercase tracking-widest">Itinerary Builder</p>
                <h1 className="font-display text-2xl text-sand">{trip?.name}</h1>
              </div>
            </div>
            <button
              onClick={handleAIGenerate}
              disabled={generating}
              className="flex items-center gap-2 bg-sun hover:bg-stone text-deep font-syne font-bold text-xs px-4 py-2 rounded-full transition-all disabled:opacity-60"
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generating ? 'Generating...' : 'AI Generate'}
            </button>
          </div>
        </div>

        {/* Stop tabs */}
        <div className="px-6 md:px-10 py-3 flex gap-2 overflow-x-auto scrollbar-none border-b border-stone/20 bg-sun/30">
          {stops.map((stop, i) => (
            <button
              key={stop.id}
              onClick={() => setActiveStop(stop.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-syne text-xs transition-all ${
                activeStop === stop.id
                  ? 'bg-earth text-sand shadow-sm'
                  : 'bg-sand/60 text-deep border border-stone/20 hover:bg-sand'
              }`}
            >
              <MapPin size={12} />
              {stop.city_name}
              <span className="opacity-50 text-[10px]">{stop.days}d</span>
            </button>
          ))}
        </div>

        {/* Activities */}
        {stops.map(stop => (
          activeStop === stop.id && (
            <div key={stop.id} className="px-6 md:px-10 py-6">
              {/* Stop Banner */}
              <div className="relative h-32 rounded-2xl overflow-hidden mb-6 group">
                <ArchImage
                  src={getFallbackPhoto(stop.city_name)}
                  alt={stop.city_name}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-deep/80 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6">
                  <h2 className="font-playfair text-2xl text-sand">{stop.city_name}</h2>
                  <p className="font-syne text-xs text-sun/70 uppercase tracking-widest" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    {stop.city_name_hindi} · {stop.days} day{stop.days !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {(!activities[stop.id] || activities[stop.id].length === 0) ? (
                <div className="text-center py-12 bg-sun/20 rounded-2xl border border-stone/20">
                  <Sparkles size={32} className="mx-auto text-earth/30 mb-3" />
                  <p className="font-playfair text-lg text-earth/50">No activities yet</p>
                  <p className="font-dm-sans text-dust text-sm mt-1">Use AI Generate or add activities manually</p>
                  <button
                    onClick={handleAIGenerate}
                    disabled={generating}
                    className="inline-flex items-center gap-2 mt-4 bg-earth text-sand font-syne text-xs px-5 py-2.5 rounded-full"
                  >
                    <Sparkles size={13} />
                    Generate Itinerary
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities[stop.id].map((act, i) => {
                    const type = getActivityTypeLabel(act.type)
                    return (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-sun/60 border border-stone/20 rounded-2xl p-4 flex items-start gap-3"
                      >
                        <span className="text-xl mt-0.5">{getActivityIcon(act.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-dm-sans font-semibold text-deep text-sm">{act.name}</p>
                              <p className="font-syne text-[10px] text-dust">{act.time} · {act.duration_min}min</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`font-syne text-[10px] px-2 py-0.5 rounded-full ${type.color}`}>{type.en}</span>
                              {act.cost_inr > 0 && (
                                <span className="font-syne text-xs text-earth font-medium">₹{act.cost_inr.toLocaleString('en-IN')}</span>
                              )}
                              <button onClick={() => deleteActivity(stop.id, act.id)} className="text-dust hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          {act.description && (
                            <p className="font-dm-sans text-xs text-dust mt-1 line-clamp-2">{act.description}</p>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
