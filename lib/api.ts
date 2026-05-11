// API fetch wrappers for TRAVELOOP

export interface CityResult {
  name: string
  nameHindi: string
  state: string
  lat: number
  lng: number
  wikiDataId?: string
}

export interface PhotoResult {
  url: string
  thumb: string
  alt: string
  photographer: string
}

export interface GeneratedActivity {
  name: string
  nameHindi: string
  type: 'sightseeing' | 'food' | 'transport' | 'stay' | 'adventure' | 'shopping'
  time: string
  durationMin: number
  costInr: number
  description: string
}

export interface GeneratedStop {
  cityName: string
  cityNameHindi: string
  days: number
  activities: GeneratedActivity[]
}

export interface GeneratedItinerary {
  stops: GeneratedStop[]
}

export interface ChecklistItem {
  name: string
  category: 'clothing' | 'documents' | 'electronics' | 'toiletries' | 'health' | 'misc'
}

export async function searchCities(query: string): Promise<CityResult[]> {
  const res = await fetch(`/api/cities?q=${encodeURIComponent(query)}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.cities || []
}

export async function fetchCityPhotos(city: string): Promise<PhotoResult[]> {
  const res = await fetch(`/api/photos?city=${encodeURIComponent(city)}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.photos || []
}

export async function generateItinerary(
  cities: string[],
  startDate: string,
  endDate: string,
  budget: number
): Promise<GeneratedItinerary | null> {
  const res = await fetch('/api/generate-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cities, startDate, endDate, budget }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    console.error('Itinerary API error:', errorData)
    return null
  }
  return res.json()
}

export async function suggestChecklist(
  cities: string[],
  duration: number
): Promise<ChecklistItem[]> {
  const res = await fetch('/api/checklist-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cities, duration }),
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.items || []
}

import { getCityPhoto } from './photos'

// Re-export or alias if needed, but here we'll just implement it using the better source
export function getFallbackPhoto(city: string, state?: string): string {
  return getCityPhoto(city, state)
}

