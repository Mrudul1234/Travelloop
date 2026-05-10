import { NextRequest, NextResponse } from 'next/server'

const MOCK_ITINERARY = (cities: string[]) => ({
  stops: cities.map(city => ({
    cityName: city,
    cityNameHindi: city,
    days: 2,
    activities: [
      {
        name: `Explore ${city} Old Town`,
        nameHindi: `${city} पुराना शहर`,
        type: 'sightseeing',
        time: '09:00',
        durationMin: 120,
        costInr: 500,
        description: `Start your day exploring the historic heart of ${city}.`,
      },
      {
        name: 'Local Breakfast',
        nameHindi: 'स्थानीय नाश्ता',
        type: 'food',
        time: '08:00',
        durationMin: 45,
        costInr: 200,
        description: `Try authentic local breakfast specialties of ${city}.`,
      },
      {
        name: `${city} Museum Visit`,
        nameHindi: `संग्रहालय`,
        type: 'sightseeing',
        time: '14:00',
        durationMin: 90,
        costInr: 100,
        description: `Visit the local museum to learn about the history and culture.`,
      },
      {
        name: 'Evening Street Food',
        nameHindi: 'शाम का स्ट्रीट फूड',
        type: 'food',
        time: '18:00',
        durationMin: 60,
        costInr: 300,
        description: `Sample local street food at the evening bazaar.`,
      },
    ],
  })),
})

export async function POST(request: NextRequest) {
  // 1. Initial Data Extraction
  let cities: string[] = []
  let startDate = ''
  let endDate = ''
  let budget = 0

  try {
    const body = await request.json()
    cities = body.cities || []
    startDate = body.startDate || ''
    endDate = body.endDate || ''
    budget = body.budget || 30000
  } catch (e) {
    console.error('Failed to parse request body')
  }

  // 2. Safety Check
  if (!cities || cities.length === 0) {
    cities = ['Jaipur', 'Delhi'] // Emergency fallback
  }

  const apiKey = process.env.GEMINI_API_KEY

  // 3. Primary AI Path (Gemini)
  if (apiKey) {
    try {
      const prompt = `You are an expert Indian travel planner. Create a detailed day-by-day itinerary for a trip to ${cities.join(', ')}, India from ${startDate} to ${endDate} with a budget of ₹${budget}.
      
      Return ONLY valid JSON in this exact format:
      {
        "stops": [
          {
            "cityName": "string",
            "cityNameHindi": "string in Hindi",
            "days": number,
            "activities": [
              {
                "name": "Activity name",
                "nameHindi": "Hindi name",
                "type": "sightseeing|food|transport|stay|adventure|shopping",
                "time": "HH:MM",
                "durationMin": number,
                "costInr": number,
                "description": "2-3 sentences"
              }
            ]
          }
        ]
      }`

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (text) {
          text = text.replace(/```json/g, '').replace(/```/g, '').trim()
          const parsed = JSON.parse(text)
          if (parsed.stops && Array.isArray(parsed.stops)) {
            console.log('Successfully generated itinerary via Gemini')
            return NextResponse.json(parsed)
          }
        }
      } else {
        console.error('Gemini API Error Status:', res.status)
      }
    } catch (err) {
      console.error('Gemini Execution Error:', err)
    }
  }

  // 4. Guaranteed Fallback Path (Mock)
  console.log('Returning high-fidelity mock itinerary')
  return NextResponse.json(MOCK_ITINERARY(cities))
}
