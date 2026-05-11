'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, PieChart, Wallet, CreditCard, ShoppingBag, Utensils, Car, Home, IndianRupee } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { MainContent } from '@/components/layout/MainContent'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { MandalaWatermark } from '@/components/ui/MandalaWatermark'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'transport', icon: Car, label: 'Transport', color: '#724E43' },
  { id: 'food', icon: Utensils, label: 'Food', color: '#FCD594' },
  { id: 'stay', icon: Home, label: 'Stay', color: '#BAAEA2' },
  { id: 'shopping', icon: ShoppingBag, label: 'Shopping', color: '#9F8A7E' },
  { id: 'misc', icon: CreditCard, label: 'Misc', color: '#4A2F21' },
]

export default function BudgetPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [trip, setTrip] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'misc' })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', id).single()
      if (!tripData) { router.push('/trips'); return }
      setTrip(tripData)

      const { data: expenseData } = await supabase.from('expenses').select('*').eq('trip_id', id).order('created_at', { ascending: false })
      setExpenses(expenseData || [])
      setLoading(false)
    }
    load()
  }, [id])

  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.amount) {
      toast.error('Please fill in name and amount')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('expenses').insert({
      trip_id: id,
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    }).select().single()

    if (error) {
      toast.error('Failed to add expense')
    } else {
      setExpenses([data, ...expenses])
      setNewExpense({ name: '', amount: '', category: 'misc' })
      setShowAdd(false)
      toast.success('Expense added! 💰')
    }
  }

  const handleDelete = async (expId: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', expId)
    if (error) {
      toast.error('Failed to delete')
    } else {
      setExpenses(expenses.filter(e => e.id !== expId))
      toast.success('Deleted')
    }
  }

  const totalSpent = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0)
  const remaining = (trip?.total_budget || 0) - totalSpent

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
        <div className="bg-deep px-6 md:px-10 py-10 relative overflow-hidden">
          <MandalaWatermark size={300} opacity={0.05} color="#FCD594" className="right-0 top-0" />
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-sand/10 backdrop-blur flex items-center justify-center text-sand mb-6">
            <ArrowLeft size={16} />
          </button>
          <h1 className="font-display text-4xl text-sand">Budget Tracker</h1>
          <p className="font-syne text-xs text-sun/60 uppercase tracking-widest mt-1">{trip?.name}</p>
        </div>

        <div className="px-6 md:px-10 py-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sun p-6 rounded-3xl border border-stone/20">
              <p className="font-syne text-[10px] text-earth uppercase tracking-widest mb-1">Total Budget</p>
              <p className="font-display text-3xl text-deep">{formatCurrency(trip?.total_budget)}</p>
            </div>
            <div className="bg-white/40 p-6 rounded-3xl border border-stone/20">
              <p className="font-syne text-[10px] text-earth uppercase tracking-widest mb-1">Total Spent</p>
              <p className="font-display text-3xl text-deep">{formatCurrency(totalSpent)}</p>
            </div>
            <div className={`p-6 rounded-3xl border border-stone/20 ${remaining < 0 ? 'bg-danger/10 text-danger' : 'bg-earth text-sand'}`}>
              <p className="font-syne text-[10px] uppercase tracking-widest mb-1 opacity-60">Remaining</p>
              <p className="font-display text-3xl">{formatCurrency(remaining)}</p>
            </div>
          </div>

          {/* Expense List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl text-deep">Expenses</h2>
              <button 
                onClick={() => setShowAdd(true)}
                className="bg-earth text-sand px-4 py-2 rounded-full font-syne text-xs font-bold flex items-center gap-2"
              >
                <Plus size={14} /> Add Expense
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-20 bg-sun/20 rounded-[2rem] border border-dashed border-stone/40">
                <IndianRupee size={48} className="mx-auto text-earth/20 mb-4" />
                <p className="font-dm-sans text-dust">No expenses logged yet. Start tracking!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((exp, i) => {
                  const CatIcon = CATEGORIES.find(c => c.id === exp.category)?.icon || CreditCard
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-stone/10 hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sun/30 flex items-center justify-center text-earth">
                        <CatIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-outfit font-bold text-deep">{exp.name}</p>
                        <p className="font-syne text-[10px] text-dust uppercase tracking-wider">{exp.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-xl text-deep">{formatCurrency(exp.amount)}</p>
                        <button onClick={() => handleDelete(exp.id)} className="text-danger/40 hover:text-danger mt-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-deep/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-sand rounded-[2rem] p-8 shadow-2xl overflow-hidden"
            >
              <MandalaWatermark size={200} opacity={0.05} color="#724E43" className="-top-10 -right-10" />
              
              <h2 className="font-display text-3xl text-deep mb-6">New Expense</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="font-syne text-[10px] text-earth uppercase tracking-widest block mb-2">What for?</label>
                  <input 
                    value={newExpense.name}
                    onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                    placeholder="e.g. Dinner at City Palace"
                    className="w-full bg-white/50 border border-stone/20 rounded-xl px-4 py-3 font-dm-sans text-sm focus:outline-none focus:border-earth"
                  />
                </div>
                
                <div>
                  <label className="font-syne text-[10px] text-earth uppercase tracking-widest block mb-2">Amount (₹)</label>
                  <input 
                    type="number"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-white/50 border border-stone/20 rounded-xl px-4 py-3 font-dm-sans text-sm focus:outline-none focus:border-earth"
                  />
                </div>

                <div>
                  <label className="font-syne text-[10px] text-earth uppercase tracking-widest block mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewExpense({...newExpense, category: cat.id})}
                        className={`py-2 rounded-lg border text-[10px] font-syne uppercase tracking-wider transition-all ${
                          newExpense.category === cat.id ? 'bg-earth text-sand border-earth' : 'bg-white/30 border-stone/10 text-dust'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-3.5 rounded-full font-syne font-bold text-xs text-deep bg-sun/40"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddExpense}
                    className="flex-1 py-3.5 rounded-full font-syne font-bold text-xs text-sand bg-earth shadow-lg"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </MainContent>
      <BottomNav />
    </div>
  )
}
