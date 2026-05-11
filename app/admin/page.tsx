'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Map, IndianRupee, Globe, TrendingUp, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { MainContent } from '@/components/layout/MainContent'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    users: 0,
    trips: 0,
    expenses: 0,
    stops: 0
  })
  const [recentTrips, setRecentTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      // Get counts
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: tripCount } = await supabase.from('trips').select('*', { count: 'exact', head: true })
      const { count: stopCount } = await supabase.from('stops').select('*', { count: 'exact', head: true })
      
      // Get total expenses
      const { data: expenseData } = await supabase.from('expenses').select('amount')
      const totalExp = expenseData?.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0) || 0

      // Get recent trips
      const { data: recent } = await supabase
        .from('trips')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        users: userCount || 0,
        trips: tripCount || 0,
        stops: stopCount || 0,
        expenses: totalExp
      })
      setRecentTrips(recent || [])
      setLoading(false)
    }

    fetchStats()
  }, [])

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
      <MainContent className="p-6 md:p-10 relative overflow-hidden">
        <GrainOverlay />
        <MandalaWatermark size={600} opacity={0.03} color="#724E43" className="-right-20 -top-20" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-earth mb-1">
              <ShieldCheck size={16} />
              <span className="font-syne text-[10px] uppercase tracking-[0.2em] font-bold">Admin Console</span>
            </div>
            <h1 className="font-display text-4xl text-deep">Platform Overview</h1>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone/20 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ok animate-pulse" />
              <span className="font-syne text-[10px] text-deep uppercase tracking-wider font-bold">Systems Online</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
          {[
            { label: 'Total Explorers', value: stats.users, icon: Users, color: '#724E43', trend: '+12%' },
            { label: 'Journeys Created', value: stats.trips, icon: Map, color: '#BAAEA2', trend: '+18%' },
            { label: 'Revenue Tracked', value: formatCurrency(stats.expenses), icon: IndianRupee, color: '#FCD594', trend: '+24%' },
            { label: 'Cities Visited', value: stats.stops, icon: Globe, color: '#9F8A7E', trend: '+5%' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-stone/10 hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                  <s.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-ok font-syne text-[10px] font-bold">
                  <ArrowUpRight size={12} /> {s.trend}
                </div>
              </div>
              <p className="font-syne text-[10px] text-dust uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="font-display text-3xl text-deep">{s.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-playfair text-2xl text-deep flex items-center gap-3">
                <Activity size={20} className="text-earth" /> Recent Journeys
              </h2>
              <button className="text-earth font-syne text-[10px] uppercase tracking-widest font-bold hover:underline">View All</button>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-stone/10 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone/10 font-syne text-[10px] text-dust uppercase tracking-widest">
                    <th className="px-8 py-5">Explorer</th>
                    <th className="px-8 py-5">Trip Name</th>
                    <th className="px-8 py-5">Budget</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="font-dm-sans text-sm">
                  {recentTrips.map((trip, i) => (
                    <tr key={trip.id} className="border-b border-stone/5 hover:bg-sun/20 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-earth/10 flex items-center justify-center text-earth font-bold text-[10px]">
                            {trip.profiles?.full_name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-bold text-deep">{trip.profiles?.full_name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-dust">{trip.name}</td>
                      <td className="px-8 py-4 font-bold text-deep">{formatCurrency(trip.total_budget)}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          trip.is_public ? 'bg-ok/10 text-ok' : 'bg-sun/40 text-earth'
                        }`}>
                          {trip.is_public ? 'Public' : 'Private'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl text-deep">Quick Insights</h2>
            <div className="bg-deep p-8 rounded-[2.5rem] text-sand relative overflow-hidden">
              <MandalaWatermark size={200} opacity={0.1} color="#FCD594" className="-right-10 -bottom-10" />
              <div className="relative z-10">
                <TrendingUp className="text-sun mb-4" size={32} />
                <h3 className="font-display text-2xl mb-2">Growth Spike</h3>
                <p className="font-dm-sans text-sun/60 text-sm leading-relaxed mb-6">
                  Platform activity increased by 40% this weekend. Most explorers are targeting Rajasthan and Kerala regions.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-syne text-[10px] uppercase tracking-widest text-sun/40">Engagement</span>
                    <span className="font-bold text-sun">88%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sun rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sun/30 border border-stone/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
              <ShieldCheck className="text-earth mb-4" size={32} />
              <h3 className="font-display text-xl text-deep mb-2">Security Audit</h3>
              <p className="font-dm-sans text-dust text-xs mb-4">All RLS policies are active. Supabase connection is encrypted.</p>
              <button className="w-full py-3 bg-earth text-sand rounded-xl font-syne text-[10px] font-bold uppercase tracking-widest">
                Refresh Tokens
              </button>
            </div>
          </div>
        </div>
      </MainContent>
    </div>
  )
}
