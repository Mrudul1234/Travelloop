import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          language: string | null
          created_at: string
          updated_at: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          cover_photo: string | null
          start_date: string | null
          end_date: string | null
          total_budget: number
          spent_budget: number
          travel_style: string[] | null
          status: 'draft' | 'upcoming' | 'ongoing' | 'past' | null
          is_public: boolean
          slug: string | null
          created_at: string
        }
      }
      stops: {
        Row: {
          id: string
          trip_id: string
          city_name: string
          city_name_hindi: string | null
          state: string | null
          lat: number | null
          lng: number | null
          cover_photo: string | null
          days: number
          position: number
          created_at: string
        }
      }
      activities: {
        Row: {
          id: string
          trip_id: string
          stop_id: string
          name: string
          name_hindi: string | null
          type: 'sightseeing' | 'food' | 'transport' | 'stay' | 'adventure' | 'shopping'
          time: string | null
          day_number: number
          duration_min: number
          cost_inr: number
          description: string | null
          notes: string | null
          photo_url: string | null
          position: number
          created_at: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          trip_id: string
          name: string
          category: 'clothing' | 'documents' | 'electronics' | 'toiletries' | 'health' | 'misc'
          checked: boolean
          created_at: string
        }
      }
      expenses: {
        Row: {
          id: string
          trip_id: string
          name: string
          amount: number
          category: string
          date: string | null
          notes: string | null
          created_at: string
        }
      }
      trip_notes: {
        Row: {
          id: string
          trip_id: string
          stop_id: string | null
          title: string | null
          content: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
