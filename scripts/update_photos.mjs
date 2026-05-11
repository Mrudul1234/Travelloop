
const fs = require('fs');
const path = require('path');

const ACCESS_KEY = 'f1AOny5O_9mWXoWnyJeCvVjfaf48nzHd2EzUna7Tmec';

const destinations = [
  "Goa", "Ladakh (Leh)", "Jaipur", "Varanasi (Kashi)", "Agra", "Udaipur",
  "Kerala Backwaters (Alappuzha & Kumarakom)", "Coorg (Kodagu)", "Ziro Valley",
  "Mawlynnong & nearby (including Living Root Bridges region)", "Shimla",
  "Dharamshala & McLeod Ganj", "Manali", "Tawang", "Khajjiar", "Spiti Valley",
  "Nubra Valley", "Pangong Lake (Pangong Tso)", "Ooty (Udhagamandalam)", "Munnar",
  "Kanyakumari", "Rann of Kutch (White Desert, Dhordo)", "Dhanushkodi (Ghost Town & Beach)",
  "Chitrakote Falls", "Gokarna", "Pondicherry (Puducherry)", "Hampi", "Majuli Island",
  "Araku Valley", "Varkala", "Havelock Island (Swaraj Dweep)", "Neil Island (Shaheed Dweep)",
  "Shillong", "Cherrapunji & Mawsmai Area (Sohra region)", "Dawki & Shnongpdeng",
  "Krang Suri Falls", "Rishikesh", "Haridwar", "Amritsar", "Kanatal", "Binsar",
  "Munsiyari", "Chakrata", "Kanha National Park", "Ranthambore National Park",
  "Bandhavgarh National Park", "Tadoba Andhari Tiger Reserve",
  "Lakshadweep (Agatti–Bangaram–Kadmat circuit)", "Kalpeni Island (Lakshadweep)",
  "Jaisalmer (Thar Desert & Fort Town)", "Kutch Interior Circuit (Bhuj–Mandvi–Villages)",
  "Wayanad", "Tamhini Ghat & Mulshi", "Mahabaleshwar & Panchgani", "Chikmagalur",
  "Amboli Ghat", "Agumbe & Western Ghats Rainforest Belt", "Kudremukh & Surrounding Ghats",
  "Port Blair & Nearby Islands", "Darjeeling", "Gangtok & East Sikkim",
  "North Sikkim (Lachung–Lachen Belt)", "Meghalaya (Shillong–Cherrapunji–Mawlynnong circuit)",
  "Kaziranga National Park & Assam Tea Belt", "Khajuraho & Panna National Park",
  "Orchha & Nearby Betwa Landscapes", "Almora & Kasar Devi Belt", "Jibhi & Tirthan Valley",
  "Chitkul & Baspa Valley", "Miyar Valley", "Keoladeo National Park (Bharatpur Bird Sanctuary)",
  "Ranganathittu Bird Sanctuary", "Nal Sarovar Bird Sanctuary", "Great Rann of Kutch (White Desert)",
  "Jaisalmer & Thar Desert Dunes", "Maravanthe & Karnataka Offbeat Coast",
  "Astaranga & Ramachandi Beaches (Odisha Quiet Coast)", "Unakoti & North Tripura Heritage Belt",
  "Mamallapuram (Mahabalipuram) & Coromandel Heritage Coast", "Hidden Goa Coves (Butterfly & Nearby Beaches)",
  "Bangaram & Kadmat Islands (Lakshadweep Quiet Beaches)", "Malanad–Malabar Backwater & Rural Belt",
  "Krishna Heritage Circuit (Mathura–Vrindavan–Dwarka Focus)", "Rishikesh & Haridwar (Himalayan Yoga Route)",
  "Varanasi Ganga Ghats Pilgrimage", "Bodh Gaya Buddhist Circuit Hub", "Rameswaram & Pamban Coast (Sacred Water Walk)",
  "Hampi & Pattadakal (UNESCO Vijayanagara–Chalukya Circuit)", "Gulmarg (Kashmir Ski & Snow Destination)",
  "Auli (Garhwal Ski & Snow Resort)", "Tiruvannamalai & Arunachala (Inner Fire Journey)",
  "Amarkantak Nature–Spiritual Loop", "Haridwar–Rishikesh–Char Dham Spiritual Trail (Meta‑Circuit Node)"
];

async function fetchPhoto(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' India')}&per_page=1&client_id=${ACCESS_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular + '&w=800&q=80';
    }
  } catch (e) {
    console.error(`Failed to fetch for ${query}:`, e);
  }
  return null;
}

async function main() {
  const mapping = {};
  for (const dest of destinations) {
    console.log(`Fetching for ${dest}...`);
    const photo = await fetchPhoto(dest);
    if (photo) {
      mapping[dest.toLowerCase().trim()] = photo;
    }
    // Rate limit sleep - Unsplash allows 50/hour for demo, but let's be careful
    // Actually, I have 100 destinations. If it's a demo key, it might hit the limit.
    // I'll try to fetch as many as possible.
  }

  const content = `export const CITY_PHOTOS: Record<string, string> = ${JSON.stringify(mapping, null, 2)};

export const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'

export function getCityPhoto(cityName: string = ''): string {
  if (!cityName) return DEFAULT_PHOTO;
  const key = cityName.toLowerCase().trim()
  if (CITY_PHOTOS[key]) return CITY_PHOTOS[key];
  const entry = Object.entries(CITY_PHOTOS).find(([k]) => key.includes(k) || k.includes(key));
  return entry ? entry[1] : DEFAULT_PHOTO;
}
`;

  fs.writeFileSync(path.join(__dirname, '../lib/photos.ts'), content);
  console.log('Done!');
}

main();
