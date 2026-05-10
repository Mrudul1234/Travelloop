'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, PlusCircle, ChevronRight, Loader2, Sparkles, Calendar, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { searchCities, generateItinerary } from '@/lib/api'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { JaliDivider } from '@/components/ui/JaliDivider'
import { slugify, daysBetween } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { CityResult } from '@/lib/api'

const TRAVEL_STYLES = [
  { id: 'cultural', label: 'Cultural Heritage', hindi: 'विरासत', icon: '🏛' },
  { id: 'adventure', label: 'Adventure', hindi: 'साहसिक', icon: '🧗' },
  { id: 'spiritual', label: 'Spiritual', hindi: 'आध्यात्मिक', icon: '🕉' },
  { id: 'nature', label: 'Nature & Wildlife', hindi: 'प्रकृति', icon: '🌿' },
  { id: 'food', label: 'Food & Culinary', hindi: 'भोजन', icon: '🍛' },
  { id: 'luxury', label: 'Luxury', hindi: 'विलासिता', icon: '✨' },
]

function NewTripContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const [tripName, setTripName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState(15000)
  const [travelStyle, setTravelStyle] = useState<string[]>([])

  const [cityQuery, setCityQuery] = useState('')
  const [cityResults, setCityResults] = useState<CityResult[]>([])
  const [selectedCities, setSelectedCities] = useState<CityResult[]>([])
  const [cityLoading, setCityLoading] = useState(false)

  // Pre-fill destination from URL
  useEffect(() => {
    const dest = searchParams.get('city') || searchParams.get('destination')
    if (dest) {
      searchCities(dest).then(res => {
        if (res.length > 0) setSelectedCities([res[0]])
      })
      setTripName(`My ${dest} Trip`)
    }
  }, [searchParams])

  const handleCitySearch = useCallback(async (q: string) => {
    setCityQuery(q)
    if (q.length < 2) { setCityResults([]); return }
    setCityLoading(true)
    const res = await searchCities(q)
    setCityResults(res.filter(c => !selectedCities.find(s => s.name === c.name)))
    setCityLoading(false)
  }, [selectedCities])

  const addCity = (city: CityResult) => {
    setSelectedCities(prev => [...prev, city])
    setCityQuery('')
    setCityResults([])
  }

  const removeCity = (name: string) => {
    setSelectedCities(prev => prev.filter(c => c.name !== name))
  }

  const handleCreateTrip = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please sign in first'); return }
    if (selectedCities.length === 0) { toast.error('Add at least one city'); return }
    if (!startDate || !endDate) { toast.error('Select travel dates'); return }

    setSaving(true)
    try {
      const name = tripName || `${selectedCities.map(c => c.name).join(' → ')} Trip`
      const { data: trip, error } = await supabase.from('trips').insert({
        user_id: user.id,
        name,
        slug: slugify(name),
        start_date: startDate,
        end_date: endDate,
        total_budget: budget,
        travel_style: travelStyle,
        status: 'draft',
      }).select().single()

      if (error) throw error

      if (selectedCities.length > 0) {
        const stops = selectedCities.map((c, i) => ({
          trip_id: trip.id,
          city_name: c.name,
          city_name_hindi: c.nameHindi || c.name,
          position: i,
          days: Math.ceil(daysBetween(startDate, endDate) / selectedCities.length),
          lat: c.lat,
          lng: c.lng,
        }))
        await supabase.from('stops').insert(stops)
      }

      toast.success('Trip created! Let\'s build your itinerary 🗺')
      router.push(`/trips/${trip.id}/build`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create trip')
    } finally {
      setSaving(false)
    }
  }

  const handleAIGenerate = async () => {
    if (selectedCities.length === 0 || !startDate || !endDate) {
      toast.error('Fill in cities and dates first')
      return
    }
    setAiLoading(true)
    const result = await generateItinerary(
      selectedCities.map(c => c.name),
      startDate,
      endDate,
      budget
    )
    setAiLoading(false)
    if (!result) { toast.error('AI generation failed, try again'); return }
    toast.success('AI itinerary ready!')
    // Proceed to create trip then build page
    await handleCreateTrip()
  }

  const totalDays = daysBetween(startDate, endDate)

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <GrainOverlay />

        {/* Header */}
        <div className="relative bg-deep px-6 md:px-10 py-8 overflow-hidden">
          <MandalaWatermark size={300} opacity={0.06} color="#FCD594" className="right-4 top-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <p className="font-syne text-xs text-sun/50 uppercase tracking-widest mb-1">नई यात्रा</p>
            <h1 className="font-display text-3xl text-sand">Plan a New Trip</h1>
            <p className="font-dm-sans text-sand/50 text-sm mt-1">Tell us where you want to go</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          {/* Trip name */}
          <div>
            <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">Trip Name</label>
            <input
              value={tripName}
              onChange={e => setTripName(e.target.value)}
              placeholder="e.g. Rajasthan Royal Tour 👑"
              className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 font-dm-sans text-sm text-deep placeholder:text-dust focus:outline-none focus:border-earth"
            />
          </div>

          {/* City search */}
          <div>
            <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">Destinations</label>

            {/* Selected cities */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCities.map((city, i) => (
                  <div key={city.name} className="flex items-center gap-2 bg-earth text-sand pl-3 pr-2 py-1.5 rounded-full">
                    <span className="font-syne text-xs font-medium">{city.name}</span>
                    {i < selectedCities.length - 1 && <ChevronRight size={12} className="opacity-50" />}
                    <button onClick={() => removeCity(city.name)} className="opacity-60 hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dust pointer-events-none" />
              <input
                value={cityQuery}
                onChange={e => handleCitySearch(e.target.value)}
                placeholder="Search Indian cities..."
                className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 pl-9 font-dm-sans text-sm text-deep placeholder:text-dust focus:outline-none focus:border-earth"
              />
              {cityLoading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth animate-spin" />}
            </div>

            <AnimatePresence>
              {cityResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-2 bg-sand border border-stone/30 rounded-xl overflow-hidden shadow-lg"
                >
                  {cityResults.map(city => (
                    <button
                      key={city.name}
                      onClick={() => addCity(city)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-sun/40 transition-colors text-left"
                    >
                      <div>
                        <span className="font-dm-sans text-sm text-deep">{city.name}</span>
                        <span className="font-syne text-xs text-dust ml-2">{city.state}</span>
                      </div>
                      <span className="font-syne text-xs text-earth" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {city.nameHindi}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">
                <Calendar size={12} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 font-dm-sans text-sm text-deep focus:outline-none focus:border-earth"
              />
            </div>
            <div>
              <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">
                <Calendar size={12} className="inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 font-dm-sans text-sm text-deep focus:outline-none focus:border-earth"
              />
            </div>
          </div>
          {totalDays > 0 && (
            <p className="font-syne text-xs text-earth -mt-4">
              {totalDays} day{totalDays !== 1 ? 's' : ''} journey
            </p>
          )}

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-syne text-xs text-earth uppercase tracking-wide">
                <Wallet size={12} className="inline mr-1" />
                Budget
              </label>
              <span className="font-display text-lg text-deep">
                ₹{budget.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={budget}
              onChange={e => setBudget(parseInt(e.target.value))}
              className="w-full accent-earth"
            />
            <div className="flex justify-between font-syne text-xs text-dust mt-1">
              <span>₹5K</span>
              <span>₹5L</span>
            </div>
          </div>

          {/* Travel style */}
          <div>
            <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-3">Travel Style</label>
            <div className="grid grid-cols-3 gap-2">
              {TRAVEL_STYLES.map(({ id, label, hindi, icon }) => {
                const selected = travelStyle.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => setTravelStyle(prev =>
                      selected ? prev.filter(s => s !== id) : [...prev, id]
                    )}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-center transition-all ${
                      selected
                        ? 'bg-earth border-earth text-sand'
                        : 'bg-sun/20 border-stone/30 text-deep hover:bg-sun/40'
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="font-syne text-[10px] font-medium leading-tight">{label}</span>
                    <span className="text-[9px] opacity-50" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{hindi}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <JaliDivider />

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAIGenerate}
              disabled={aiLoading || saving}
              className="w-full flex items-center justify-center gap-2 bg-earth hover:bg-deep text-sand font-syne font-bold text-sm py-4 rounded-full transition-all hover:scale-[1.01] disabled:opacity-60"
            >
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Generate with AI ✨
            </button>
            <button
              onClick={handleCreateTrip}
              disabled={saving || aiLoading}
              className="w-full flex items-center justify-center gap-2 bg-sun/50 hover:bg-sun text-deep font-syne font-bold text-sm py-3.5 rounded-full border border-stone/30 transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
              Create & Plan Manually
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

import { Suspense } from 'react'

export default function NewTripPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-earth animate-spin" />
      </div>
    }>
      <NewTripContent />
    </Suspense>
  )
}
