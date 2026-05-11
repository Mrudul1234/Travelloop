import { NextRequest, NextResponse } from 'next/server'
import { getCityPhoto, DEFAULT_PHOTO } from '@/lib/photos'



export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city') || ''
  const state = request.nextUrl.searchParams.get('state') || ''
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (accessKey) {
    try {
      const query = `${city} ${state} India travel`.trim()
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
  const photoUrl = getCityPhoto(city, state)
  const photos = [{
    url: photoUrl,
    thumb: photoUrl.replace('w=800', 'w=200'),
    alt: `${city} India`,
    photographer: 'Unsplash',
  }]

  return NextResponse.json({ photos })
}

