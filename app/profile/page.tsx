'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Globe, LogOut, Camera, Save, MapPin, Calendar, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { JaliDivider } from '@/components/ui/JaliDivider'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({ full_name: '', email: '', avatar_url: '', bio: '' })
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
      })

      // Fetch stats
      const { data: trips } = await supabase.from('trips').select('id, start_date, end_date').eq('user_id', user.id)
      const { data: stops } = await supabase.from('stops').select('city_name').in('trip_id', trips?.map(t => t.id) || [])
      
      const uniqueCities = new Set(stops?.map(s => s.city_name)).size
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
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-10 max-w-2xl">
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl text-deep">Profile Settings</h2>
            
            <div className="space-y-4">
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
                <label className="font-syne text-xs text-earth uppercase tracking-wide block mb-2">Language Preference</label>
                <div className="flex gap-2">
                  {['English', 'Hindi', 'Bengali', 'Tamil'].map(lang => (
                    <button key={lang} className="px-4 py-2 rounded-full border border-stone/30 text-xs font-syne text-deep hover:bg-sun/40 transition-colors">
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-earth hover:bg-deep text-sand font-syne font-bold text-sm py-3.5 rounded-full transition-all"
              >
                {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 bg-sun/40 hover:bg-sun/60 text-deep font-syne font-bold text-sm px-8 py-3.5 rounded-full transition-all"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
            
            <JaliDivider />
            
            <div className="pt-4">
              <h3 className="font-playfair text-xl text-deep mb-4">Badges & Achievements</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: '🏯', label: 'Heritage Hunter' },
                  { icon: '🚂', label: 'Rail Rover' },
                  { icon: '🍛', label: 'Spice Seeker' },
                  { icon: '🧗', label: 'Himalayan Hero' },
                ].map(badge => (
                  <div key={badge.label} className="flex flex-col items-center gap-2 bg-sun/30 border border-stone/20 rounded-2xl p-4 w-28 text-center grayscale hover:grayscale-0 transition-all cursor-help group relative">
                    <span className="text-3xl">{badge.icon}</span>
                    <span className="font-syne text-[10px] text-deep uppercase leading-tight">{badge.label}</span>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep text-sand text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Complete more trips to unlock
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
