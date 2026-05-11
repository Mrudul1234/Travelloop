'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Globe, LogOut, Camera, Save, MapPin, Calendar, Heart, Award, Lock, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { MainContent } from '@/components/layout/MainContent'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { JaliDivider } from '@/components/ui/JaliDivider'
import toast from 'react-hot-toast'

const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi']

const ALL_BADGES = [
  { icon: '🏯', label: 'Heritage Hunter', description: 'Create your first trip', requirement: (s: any) => s.trips >= 1 },
  { icon: '🚂', label: 'Rail Rover', description: 'Plan trips to 3+ cities', requirement: (s: any) => s.cities >= 3 },
  { icon: '🍛', label: 'Spice Seeker', description: 'Complete 5+ trips', requirement: (s: any) => s.trips >= 5 },
  { icon: '🧗', label: 'Himalayan Hero', description: 'Travel for 30+ days total', requirement: (s: any) => s.days >= 30 },
  { icon: '🌍', label: 'Wanderlust Soul', description: 'Visit 10+ unique cities', requirement: (s: any) => s.cities >= 10 },
  { icon: '📸', label: 'Memory Maker', description: 'Create 10+ trips', requirement: (s: any) => s.trips >= 10 },
]

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({ full_name: '', email: '', avatar_url: '', bio: '', language: 'English' })
  const [stats, setStats] = useState({ trips: 0, cities: 0, days: 0 })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth'; return }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile({
        full_name: profileData?.full_name || '',
        email: user.email || '',
        avatar_url: profileData?.avatar_url || '',
        bio: profileData?.bio || '',
        language: profileData?.language || 'English',
      })

      // Fetch stats
      const { data: trips } = await supabase.from('trips').select('id, start_date, end_date').eq('user_id', user.id)
      const tripIds = trips?.map(t => t.id) || []
      
      let uniqueCities = 0
      if (tripIds.length > 0) {
        const { data: stops } = await supabase.from('stops').select('city_name').in('trip_id', tripIds)
        uniqueCities = new Set(stops?.map(s => s.city_name)).size
      }
      
      const totalDays = (trips || []).reduce((acc, t) => {
        if (t.start_date && t.end_date) {
          const start = new Date(t.start_date)
          const end = new Date(t.end_date)
          return acc + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }
        return acc
      }, 0)

      setStats({
        trips: trips?.length || 0,
        cities: uniqueCities,
        days: totalDays
      })

      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        language: profile.language,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success('Profile updated! ✨')
    } catch (err: any) {
      console.error('Update error:', err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfile(p => ({ ...p, avatar_url: publicUrl }))
      toast.success('Photo uploaded to cloud! Save to apply.')
    } catch (err: any) {
      console.warn('Storage upload failed, using local preview fallback:', err)
      
      // Fallback: Read as Base64 so the user still sees the change locally
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setProfile(p => ({ ...p, avatar_url: base64 }))
        toast.success('Local preview updated! Save to apply.')
      }
      reader.readAsDataURL(file)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const unlockedCount = ALL_BADGES.filter(b => b.requirement(stats)).length

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
      <MainContent>
        <GrainOverlay />
        
        {/* Header */}
        <div className="relative bg-deep px-6 md:px-10 py-12 overflow-hidden">
          <MandalaWatermark size={400} opacity={0.07} color="#FCD594" className="right-0 top-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
              <div className="w-24 h-24 rounded-full border-2 border-sun p-1 overflow-hidden bg-earth transition-transform group-hover:scale-105">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sand text-3xl font-display">
                    {profile.full_name?.[0] || profile.email?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <Camera size={24} className="text-sand" />
              </div>
              <input 
                id="avatar-input"
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleUpload}
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl text-sand">{profile.full_name || 'Fellow Traveller'}</h1>
              <p className="font-syne text-xs text-sun/60 uppercase tracking-widest mt-1">{profile.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="text-center">
                  <p className="font-display text-xl text-sun">{stats.trips}</p>
                  <p className="font-syne text-[10px] text-sand/40 uppercase tracking-wide">Trips</p>
                </div>
                <div className="w-px h-6 bg-earth/30" />
                <div className="text-center">
                  <p className="font-display text-xl text-sun">{stats.cities}</p>
                  <p className="font-syne text-[10px] text-sand/40 uppercase tracking-wide">Cities</p>
                </div>
                <div className="w-px h-6 bg-earth/30" />
                <div className="text-center">
                  <p className="font-display text-xl text-sun">{stats.days}</p>
                  <p className="font-syne text-[10px] text-sand/40 uppercase tracking-wide">Days</p>
                </div>
                <div className="w-px h-6 bg-earth/30" />
                <div className="text-center">
                  <p className="font-display text-xl text-sun">{unlockedCount}/{ALL_BADGES.length}</p>
                  <p className="font-syne text-[10px] text-sand/40 uppercase tracking-wide">Badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-10 max-w-2xl">
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl text-deep">Profile Settings</h2>
            
            <div className="space-y-5">
              <div>
                <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" />
                  <input
                    value={profile.full_name}
                    onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full bg-white/50 border border-stone/20 rounded-xl px-4 py-3 pl-11 font-dm-sans text-sm text-deep placeholder:text-dust/50 focus:outline-none focus:border-earth focus:bg-white focus:ring-4 focus:ring-earth/5 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">Bio / Travel Philosophy</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/50 border border-stone/20 rounded-xl px-4 py-3 font-dm-sans text-sm text-deep placeholder:text-dust/50 focus:outline-none focus:border-earth focus:bg-white focus:ring-4 focus:ring-earth/5 transition-all duration-300 resize-none"
                  placeholder="Tell us about your travel style..."
                />
              </div>
              
              <div>
                <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">
                  <Globe size={14} className="inline mr-1 -mt-0.5" />
                  Language Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setProfile(p => ({ ...p, language: lang }));
                      }}
                      className={`px-4 py-2 rounded-full border text-xs font-syne transition-all duration-200 flex items-center gap-1.5 ${
                        profile.language === lang 
                          ? 'bg-earth text-sand border-earth shadow-md' 
                          : 'bg-white/50 border-stone/20 text-deep hover:bg-white'
                      }`}
                    >
                      {profile.language === lang && <Check size={12} strokeWidth={3} />}
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-earth hover:bg-deep text-sand font-syne font-bold text-sm py-4 rounded-2xl shadow-lg shadow-earth/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 bg-sun/40 hover:bg-sun/60 text-deep font-syne font-bold text-sm px-8 py-4 rounded-2xl transition-all"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
            
            <JaliDivider />
            
            {/* Badges & Achievements — now data-driven from stats */}
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-6">
                <Award size={20} className="text-earth" />
                <h3 className="font-playfair text-xl text-deep">Badges & Achievements</h3>
                <span className="ml-auto font-syne text-[10px] text-dust uppercase tracking-widest">
                  {unlockedCount} of {ALL_BADGES.length} unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ALL_BADGES.map((badge, i) => {
                  const unlocked = badge.requirement(stats)
                  return (
                    <motion.div 
                      key={badge.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative flex flex-col items-center gap-2 border rounded-2xl p-5 text-center transition-all duration-300 ${
                        unlocked 
                          ? 'bg-sun/40 border-earth/30 shadow-md shadow-earth/10' 
                          : 'bg-white/30 border-stone/15 opacity-50'
                      }`}
                    >
                      {/* Unlocked indicator */}
                      {unlocked && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-ok rounded-full flex items-center justify-center shadow-sm">
                          <Check size={12} className="text-sand" />
                        </div>
                      )}
                      {!unlocked && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone/40 rounded-full flex items-center justify-center">
                          <Lock size={10} className="text-dust" />
                        </div>
                      )}
                      <span className="text-3xl">{badge.icon}</span>
                      <span className="font-syne text-[10px] text-deep uppercase leading-tight font-bold">{badge.label}</span>
                      <span className="font-dm-sans text-[9px] text-dust leading-tight">{badge.description}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </MainContent>
      <BottomNav />
    </div>
  )
}
