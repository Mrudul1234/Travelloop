'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const supabase = createClient()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/dashboard'
    })
  }, [])

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        })
        if (error) throw error
        
        if (data.session) {
          toast.success('Account created! Welcome to Travelloop ✈️')
          window.location.href = '/dashboard'
        } else {
          toast.success('Account created! Check your email 📧')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-sand">
      <GrainOverlay />

      {/* Left panel — hero */}
      <div className="hidden lg:flex w-1/2 relative bg-deep flex-col justify-between p-12 overflow-hidden">
        <MandalaWatermark size={600} opacity={0.07} color="#FCD594" animate className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Hero image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1561361058-c24e0b74f2b0?w=1200&q=80')`,
            opacity: 0.25,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sun flex items-center justify-center">
              <span className="text-deep text-xs font-syne font-bold">T</span>
            </div>
            <span className="font-syne font-bold text-sand text-lg tracking-wider">TRAVELOOP</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <p
            className="text-sun/60 font-syne text-xs uppercase tracking-widest"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            भारत को महसूस करो
          </p>
          <h1 className="font-display text-5xl text-sand leading-tight">
            Plan your perfect<br />Indian journey.
          </h1>
          <p className="font-dm-sans text-sand/60 text-base leading-relaxed max-w-sm">
            AI-powered itineraries, budget tracking, and curated experiences — all in one place.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Indian Cities', value: '500+' },
            { label: 'Trips Planned', value: '12K+' },
            { label: 'Happy Travellers', value: '8K+' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-earth/30 rounded-xl p-4 border border-earth/20">
              <p className="font-display text-2xl text-sun">{value}</p>
              <p className="font-syne text-xs text-sand/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-earth flex items-center justify-center">
              <span className="text-sand text-xs font-syne font-bold">T</span>
            </div>
            <span className="font-syne font-bold text-deep text-lg tracking-wider">TRAVELOOP</span>
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-4xl text-deep">
                {mode === 'signin' ? 'Welcome back' : 'Start your yatra'}
              </h2>
              <p className="font-dm-sans text-dust text-sm mt-1">
                {mode === 'signin'
                  ? 'Sign in to continue planning your adventures'
                  : 'Create an account to begin your journey'}
              </p>
            </div>

            <form onSubmit={handle} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust pointer-events-none" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 pl-11 font-dm-sans text-sm text-deep placeholder:text-dust focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/10"
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust pointer-events-none" />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 pl-11 font-dm-sans text-sm text-deep placeholder:text-dust focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/10"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust pointer-events-none" />
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-sun/30 border border-stone/40 rounded-xl px-4 py-3 pl-11 pr-11 font-dm-sans text-sm text-deep placeholder:text-dust focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dust hover:text-earth"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-earth hover:bg-deep text-sand font-syne font-bold text-sm py-3.5 rounded-full transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In / प्रवेश करें' : 'Create Account'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}
                className="font-dm-sans text-sm text-dust hover:text-earth transition-colors"
              >
                {mode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
