// Utility functions for TRAVELOOP

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36)
}

export function dateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) return 'Dates TBD'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${start.toLocaleDateString('en-IN', options)} – ${end.toLocaleDateString('en-IN', { ...options, year: 'numeric' })}`
}

export function daysBetween(startDate: string | null, endDate: string | null): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function getActivityTypeLabel(type: string): { en: string; hi: string; color: string } {
  const types: Record<string, { en: string; hi: string; color: string }> = {
    sightseeing: { en: 'Sightseeing', hi: 'दर्शनीय', color: 'bg-earth/20 text-earth' },
    food: { en: 'Food', hi: 'भोजन', color: 'bg-sun text-deep' },
    transport: { en: 'Transport', hi: 'परिवहन', color: 'bg-stone/30 text-deep' },
    stay: { en: 'Stay', hi: 'ठहरना', color: 'bg-dust/20 text-deep' },
    adventure: { en: 'Adventure', hi: 'साहसिक', color: 'bg-earth text-sand' },
    shopping: { en: 'Shopping', hi: 'खरीदारी', color: 'bg-sun/50 text-deep' },
  }
  return types[type] || { en: type, hi: type, color: 'bg-stone/20 text-deep' }
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    sightseeing: '🏛',
    food: '🍛',
    transport: '🚂',
    stay: '🏨',
    adventure: '🧗',
    shopping: '🛍',
  }
  return icons[type] || '📍'
}

export function tripStatus(startDate: string | null, endDate: string | null): 'upcoming' | 'ongoing' | 'past' | 'draft' {
  if (!startDate || !endDate) return 'draft'
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (now < start) return 'upcoming'
  if (now > end) return 'past'
  return 'ongoing'
}

export function getGreetingTime(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'सुप्रभात'
  if (hour < 17) return 'नमस्ते'
  return 'शुभ संध्या'
}

// City coordinates for major Indian cities (fallback)
export const cityCoordinates: Record<string, [number, number]> = {
  'jaipur': [26.9124, 75.7873],
  'delhi': [28.7041, 77.1025],
  'mumbai': [19.0760, 72.8777],
  'goa': [15.2993, 74.1240],
  'varanasi': [25.3176, 82.9739],
  'agra': [27.1767, 78.0081],
  'jodhpur': [26.2389, 73.0243],
  'udaipur': [24.5854, 73.7125],
  'jaisalmer': [26.9157, 70.9083],
  'pushkar': [26.4899, 74.5512],
  'leh': [34.1526, 77.5771],
  'manali': [32.2432, 77.1892],
  'shimla': [31.1048, 77.1734],
  'darjeeling': [27.0360, 88.2627],
  'kerala': [10.8505, 76.2711],
  'kochi': [9.9312, 76.2673],
  'mysuru': [12.2958, 76.6394],
  'hampi': [15.3350, 76.4600],
  'pondicherry': [11.9416, 79.8083],
  'hyderabad': [17.3850, 78.4867],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'ahmedabad': [23.0225, 72.5714],
  'amritsar': [31.6340, 74.8723],
  'rishikesh': [30.0869, 78.2676],
  'haridwar': [29.9457, 78.1642],
}

export function getCityCoords(cityName: string): [number, number] {
  const key = cityName.toLowerCase()
  return cityCoordinates[key] || [20.5937, 78.9629] // Center of India
}
