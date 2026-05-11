'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Check, Sparkles, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { MainContent } from '@/components/layout/MainContent'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { suggestChecklist } from '@/lib/api'
import { daysBetween } from '@/lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES = ['clothing', 'documents', 'electronics', 'toiletries', 'health', 'misc'] as const
const CAT_ICONS: Record<string, string> = {
  clothing: '👕', documents: '📄', electronics: '📱',
  toiletries: '🪥', health: '💊', misc: '📦',
}

export default function ChecklistPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [trip, setTrip] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data: tripData } = await supabase.from('trips').select('*').eq('id', id).eq('user_id', user.id).single()
      if (!tripData) { router.push('/trips'); return }
      setTrip(tripData)
      const { data } = await supabase.from('checklist_items').select('*').eq('trip_id', id).order('category, name')
      setItems(data || [])
      setLoading(false)
    }
    load()
  }, [id])

  const handleGenerate = async () => {
    if (!trip) return
    setGenerating(true)
    const { data: stops } = await supabase.from('stops').select('city_name').eq('trip_id', id)
    const cities = (stops || []).map((s: any) => s.city_name)
    const days = daysBetween(trip.start_date, trip.end_date)
    const suggestions = await suggestChecklist(cities, days)
    if (!suggestions.length) { toast.error('Generation failed'); setGenerating(false); return }

    await supabase.from('checklist_items').delete().eq('trip_id', id)
    const toInsert = suggestions.map(s => ({ trip_id: id, name: s.name, category: s.category, checked: false }))
    const { data: saved } = await supabase.from('checklist_items').insert(toInsert).select()
    setItems(saved || [])
    setGenerating(false)
    toast.success('Packing list generated! 🧳')
  }

  const toggleItem = async (itemId: string, checked: boolean) => {
    await supabase.from('checklist_items').update({ checked: !checked }).eq('id', itemId)
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: !checked } : i))
  }

  const addItem = async () => {
    if (!newItem.trim()) return
    const { data } = await supabase.from('checklist_items').insert({ trip_id: id, name: newItem, category: 'misc', checked: false }).select().single()
    if (data) setItems(prev => [...prev, data])
    setNewItem('')
  }

  const checkedCount = items.filter(i => i.checked).length

  if (loading) return <div className="min-h-screen bg-sand flex items-center justify-center"><MandalaWatermark size={200} opacity={0.15} color="#724E43" animate /></div>

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <MainContent>
        <GrainOverlay />
        <div className="relative bg-deep px-6 md:px-10 py-6 overflow-hidden">
          <MandalaWatermark size={250} opacity={0.06} color="#FCD594" className="right-4 top-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-sand/10 flex items-center justify-center text-sand hover:bg-sand/20">
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="font-syne text-xs text-sun/50 uppercase tracking-widest">Packing List</p>
                <h1 className="font-display text-2xl text-sand">{trip?.name}</h1>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 bg-sun hover:bg-stone text-deep font-syne font-bold text-xs px-4 py-2 rounded-full disabled:opacity-60">
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Suggest
            </button>
          </div>
        </div>

        <div className="px-6 md:px-10 py-4">
          {/* Progress */}
          {items.length > 0 && (
            <div className="bg-earth/20 border border-earth/30 rounded-2xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-syne text-xs text-earth uppercase tracking-wide">Packed</span>
                <span className="font-display text-sm text-deep">{checkedCount}/{items.length}</span>
              </div>
              <div className="bg-sand/50 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-earth rounded-full transition-all" style={{ width: `${(checkedCount / items.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Add item */}
          <div className="flex gap-2 mb-6">
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="Add item..."
              className="flex-1 bg-sun/30 border border-stone/40 rounded-xl px-4 py-2.5 font-dm-sans text-sm text-deep placeholder:text-dust focus:outline-none focus:border-earth"
            />
            <button onClick={addItem} className="bg-earth text-sand px-4 py-2.5 rounded-xl flex items-center gap-1">
              <Plus size={16} />
            </button>
          </div>

          {/* Items by category */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🧳</p>
              <p className="font-playfair text-xl text-earth/50">Empty packing list</p>
              <p className="font-dm-sans text-dust text-sm mt-1">Use AI to get personalized suggestions</p>
            </div>
          ) : (
            <div className="space-y-6">
              {CATEGORIES.map(cat => {
                const catItems = items.filter(i => i.category === cat)
                if (!catItems.length) return null
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{CAT_ICONS[cat]}</span>
                      <h3 className="font-syne text-xs text-earth uppercase tracking-widest capitalize">{cat}</h3>
                      <span className="font-syne text-[10px] text-dust">({catItems.filter(i => i.checked).length}/{catItems.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {catItems.map(item => (
                        <motion.div key={item.id} layout className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-sun/30 transition-colors">
                          <button
                            onClick={() => toggleItem(item.id, item.checked)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              item.checked ? 'bg-earth border-earth' : 'border-stone/50 hover:border-earth'
                            }`}
                          >
                            {item.checked && <Check size={11} className="text-sand" />}
                          </button>
                          <span className={`font-dm-sans text-sm transition-colors ${item.checked ? 'line-through text-dust' : 'text-deep'}`}>
                            {item.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </MainContent>
      <BottomNav />
    </div>
  )
}
