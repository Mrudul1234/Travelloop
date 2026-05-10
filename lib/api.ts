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
  if (!res.ok) return null
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

// Fallback photos for Indian cities (Unsplash curated)
export const fallbackPhotos: Record<string, string> = {
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800',
  jodhpur: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800',
  udaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800',
  delhi: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=800',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800',
  varanasi: 'https://images.unsplash.com/photo-1561361058-c24e0b74f2b0?w=800',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
  ladakh: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  leh: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  default: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800',
}

export function getFallbackPhoto(city: string): string {
  const key = city.toLowerCase()
  return fallbackPhotos[key] || fallbackPhotos.default
}
