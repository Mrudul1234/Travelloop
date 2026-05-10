import { NextRequest, NextResponse } from 'next/server'

const FALLBACK_PHOTOS: Record<string, string[]> = {
  jaipur: [
    'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  ],
  jodhpur: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  ],
  udaipur: [
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
  ],
  delhi: [
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=800&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  ],
  mumbai: [
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  ],
  goa: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    'https://images.unsplash.com/photo-1599030856596-04ae58cc3f82?w=800&q=80',
  ],
  varanasi: [
    'https://images.unsplash.com/photo-1561361058-c24e0b74f2b0?w=800&q=80',
    'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80',
  ],
  agra: [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  ],
  kerala: [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
  ],
  ladakh: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  ],
  leh: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  ],
  manali: [
    'https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  ],
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city') || ''
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (accessKey) {
    try {
      const query = `${city} India travel`
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`
      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      })

      if (res.ok) {
        const data = await res.json()
        const photos = (data.results || []).map((p: any) => ({
          url: p.urls.regular,
          thumb: p.urls.thumb,
          alt: p.alt_description || `${city} travel`,
          photographer: p.user?.name || 'Unsplash',
        }))
        if (photos.length > 0) {
          return NextResponse.json({ photos })
        }
      }
    } catch (err) {
      console.error('Unsplash API error, falling back:', err)
    }
  }

  // Fallback
  const key = city.toLowerCase()
  const urls = FALLBACK_PHOTOS[key] || FALLBACK_PHOTOS.default
  const photos = urls.map((url, i) => ({
    url,
    thumb: url.replace('w=800', 'w=200'),
    alt: `${city} India`,
    photographer: 'Unsplash',
  }))

  return NextResponse.json({ photos })
}
