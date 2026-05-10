import { NextRequest, NextResponse } from 'next/server'

const MOCK_CITIES = [
  { name: 'Jaipur', nameHindi: 'जयपुर', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Jodhpur', nameHindi: 'जोधपुर', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Udaipur', nameHindi: 'उदयपुर', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Delhi', nameHindi: 'दिल्ली', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Mumbai', nameHindi: 'मुंबई', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Goa', nameHindi: 'गोआ', state: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Varanasi', nameHindi: 'वाराणसी', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Agra', nameHindi: 'आगरा', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Jaisalmer', nameHindi: 'जैसलमेर', state: 'Rajasthan', lat: 26.9157, lng: 70.9083 },
  { name: 'Pushkar', nameHindi: 'पुष्कर', state: 'Rajasthan', lat: 26.4899, lng: 74.5512 },
  { name: 'Leh', nameHindi: 'लेह', state: 'Ladakh', lat: 34.1526, lng: 77.5771 },
  { name: 'Manali', nameHindi: 'मनाली', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892 },
  { name: 'Shimla', nameHindi: 'शिमला', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { name: 'Darjeeling', nameHindi: 'दार्जिलिंग', state: 'West Bengal', lat: 27.0360, lng: 88.2627 },
  { name: 'Kochi', nameHindi: 'कोच्चि', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Mysuru', nameHindi: 'मैसूरु', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Hampi', nameHindi: 'हम्पी', state: 'Karnataka', lat: 15.3350, lng: 76.4600 },
  { name: 'Pondicherry', nameHindi: 'पुदुच्चेरी', state: 'Puducherry', lat: 11.9416, lng: 79.8083 },
  { name: 'Hyderabad', nameHindi: 'हैदराबाद', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', nameHindi: 'चेन्नई', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', nameHindi: 'कोलकाता', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Amritsar', nameHindi: 'अमृतसर', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Rishikesh', nameHindi: 'ऋषिकेश', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676 },
  { name: 'Haridwar', nameHindi: 'हरिद्वार', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642 },
  { name: 'Ahmedabad', nameHindi: 'अहमदाबाद', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
]

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  const apiKey = process.env.GEODB_API_KEY

  if (apiKey && q.length >= 2) {
    try {
      const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=IN&namePrefix=${encodeURIComponent(q)}&limit=10&sort=-population`
      const res = await fetch(url, {
        headers: {
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        const data = await res.json()
        const cities = (data.data || []).map((c: any) => ({
          name: c.name,
          nameHindi: c.name,
          state: c.region || c.country,
          lat: c.latitude,
          lng: c.longitude,
          wikiDataId: c.wikiDataId,
        }))
        if (cities.length > 0) {
          return NextResponse.json({ cities })
        }
      }
    } catch (err) {
      console.error('GeoDB API error, falling back to mock:', err)
    }
  }

  // Fallback: filter mock cities
  const filtered = q.length < 2
    ? MOCK_CITIES.slice(0, 8)
    : MOCK_CITIES.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.nameHindi.includes(q)
      ).slice(0, 10)

  return NextResponse.json({ cities: filtered })
}
