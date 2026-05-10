import { NextRequest, NextResponse } from 'next/server'

const UNIVERSAL_ITEMS = [
  { name: 'Passport / Aadhaar Card', category: 'documents' },
  { name: 'Travel insurance', category: 'documents' },
  { name: 'Hotel booking confirmations', category: 'documents' },
  { name: 'Emergency contacts list', category: 'documents' },
  { name: 'T-shirts (3-4)', category: 'clothing' },
  { name: 'Comfortable walking shoes', category: 'clothing' },
  { name: 'Light jacket / shawl', category: 'clothing' },
  { name: 'Sunglasses', category: 'clothing' },
  { name: 'Phone charger', category: 'electronics' },
  { name: 'Power bank', category: 'electronics' },
  { name: 'Earphones / headphones', category: 'electronics' },
  { name: 'Travel adapter', category: 'electronics' },
  { name: 'Toothbrush & toothpaste', category: 'toiletries' },
  { name: 'Sunscreen SPF 50+', category: 'toiletries' },
  { name: 'Hand sanitizer', category: 'toiletries' },
  { name: 'Insect repellent', category: 'toiletries' },
  { name: 'Basic first aid kit', category: 'health' },
  { name: 'Personal medications', category: 'health' },
  { name: 'ORS sachets', category: 'health' },
  { name: 'Reusable water bottle', category: 'misc' },
  { name: 'Daypack / small backpack', category: 'misc' },
  { name: 'Travel pillow', category: 'misc' },
]

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { cities = [], duration = 3 } = body

  const apiKey = process.env.GEMINI_API_KEY

  if (apiKey && cities.length > 0) {
    try {
      const prompt = `Create a packing list for a ${duration}-day trip to ${cities.join(', ')}, India.
Return ONLY valid JSON:
{
  "items": [
    { "name": "item name", "category": "clothing|documents|electronics|toiletries|health|misc" }
  ]
}
Include 20-30 items specific to the destinations and duration. Include items for Indian climate and culture.`

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024, responseMimeType: 'application/json' },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          try {
            const parsed = JSON.parse(text)
            if (parsed.items?.length > 0) return NextResponse.json(parsed)
          } catch (_) {}
        }
      }
    } catch (err) {
      console.error('Gemini checklist error:', err)
    }
  }

  return NextResponse.json({ items: UNIVERSAL_ITEMS })
}
