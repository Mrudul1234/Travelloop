const ids = [
  "TgF6eE5S3iQ", "YV7Jxf5fJiE", "-HYmYsWOMoA", "irCAvHP4TrE", "e22GaIs1VuU",
  "eCOVFez9hJs", "9fo5Qe1B_iY", "_WuPjE-MPHo", "lWgIebLTvIQ", "Thr_TUYPtAk",
  "5l56DRqrpEI", "RHNjEkxVf5I", "ws208Ry7fbk", "pZJes1QWdJg", "E2NtGFv9lX0",
  "QqJmdqfhFfI", "JnM71B4jPbU", "siUpLmbexhA", "LgQoL6eOdHs", "gQ2HORZRuoU",
  "-s529_PPy1Y", "slTVVuk7hZU", "WCgioEcEVNc", "kahaDaUfuA4", "RQCbgdmuSgo",
  "aU9yXmIwfkw", "Oen3x_COL2U", "bywypDA3hwA", "6mHQIFNBFd8", "x3y2phkf7fI",
  "cV4dZ82sNck", "fWbNy_WTMoA", "YkbPqaFr9LA", "ac3ciF7Dnxs", "a9KHeyRyFJU",
  "dPsIGTnVcy4", "iEJVyyevw-U", "1quFrRMEScA", "CoeSRUlBSwE", "ykbpWdmF2R8",
  "XjKaPInYVCM", "StvJdf9321I", "5hHx_xHSzMU", "kxmENO2ZJvc", "Lo1MM5WJiEw",
  "PHqd7WAr1lc", "f2h77fiLu18", "NLqNQ10ppe0", "PGoCSc78TyY", "D0ONyzGkc6w",
  "kZCkC-uSaAk", "nhkN69ICnEg", "L4gcI05xL6Y", "3_z-mhB2HqA", "HpWLA9mpr2o",
  "LtE6W_JVTGc", "DP20nzuie7I", "EL4NTpQevE4", "I9qh1Q_tgfU", "B34Vmj0ZgCA",
  "4d4gAscBC8Q", "vMUWnbJ5-90", "WSe6NAwwESA", "lZk9O2M2odU", "nlxNKMpUHbY",
  "d8bmhTaYtHw", "XjKaPInYVCM", "PHqd7WAr1lc", "r-2t0AuZMNQ", "Thr_TUYPtAk",
  "ws208Ry7fbk", "Lo1MM5WJiEw", "cV4dZ82sNck", "fWbNy_WTMoA", "YkbPqaFr9LA",
  "ac3ciF7Dnxs", "a9KHeyRyFJU", "dPsIGTnVcy4", "DP20nzuie7I", "EL4NTpQevE4",
  "I9qh1Q_tgfU", "4d4gAscBC8Q", "vMUWnbJ5-90", "WSe6NAwwESA", "lZk9O2M2odU",
  "nlxNKMpUHbY", "d8bmhTaYtHw", "QqJmdqfhFfI", "JnM71B4jPbU", "siUpLmbexhA",
  "LgQoL6eOdHs", "gQ2HORZRuoU", "slTVVuk7hZU", "WCgioEcEVNc", "kahaDaUfuA4",
  "RQCbgdmuSgo", "aU9yXmIwfkw", "Oen3x_COL2U", "bywypDA3hwA", "6mHQIFNBFd8",
  "x3y2phkf7fI"
];

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
  "Krang Suri Falls", "Rishikesh", "Haridwar", "Varanasi (Kashi)", "Amritsar",
  "Kanatal", "Binsar", "Munsiyari", "Chakrata", "Kanha National Park",
  "Ranthambore National Park", "Bandhavgarh National Park", "Tadoba Andhari Tiger Reserve",
  "Lakshadweep (Agatti–Bangaram–Kadmat circuit)", "Kalpeni Island (Lakshadweep)",
  "Jaisalmer (Thar Desert & Fort Town)", "Kutch Interior Circuit (Bhuj–Mandvi–Villages)",
  "Coorg (Kodagu)", "Wayanad", "Tamhini Ghat & Mulshi", "Mahabaleshwar & Panchgani",
  "Chikmagalur", "Amboli Ghat", "Agumbe & Western Ghats Rainforest Belt",
  "Kudremukh & Surrounding Ghats", "Havelock Island (Swaraj Dweep)",
  "Neil Island (Shaheed Dweep)", "Port Blair & Nearby Islands", "Darjeeling",
  "Gangtok & East Sikkim", "North Sikkim (Lachung–Lachen Belt)",
  "Meghalaya (Shillong–Cherrapunji–Mawlynnong circuit)", "Kaziranga National Park & Assam Tea Belt",
  "Khajuraho & Panna National Park", "Orchha & Nearby Betwa Landscapes", "Gokarna",
  "Almora & Kasar Devi Belt", "Tawang", "Spiti Valley", "Jibhi & Tirthan Valley",
  "Chitkul & Baspa Valley", "Miyar Valley", "Keoladeo National Park (Bharatpur Bird Sanctuary)",
  "Ranganathittu Bird Sanctuary", "Nal Sarovar Bird Sanctuary", "Great Rann of Kutch (White Desert)",
  "Jaisalmer & Thar Desert Dunes", "Maravanthe & Karnataka Offbeat Coast",
  "Astaranga & Ramachandi Beaches (Odisha Quiet Coast)", "Unakoti & North Tripura Heritage Belt",
  "Mamallapuram (Mahabalipuram) & Coromandel Heritage Coast", "Hidden Goa Coves (Butterfly & Nearby Beaches)",
  "Bangaram & Kadmat Islands (Lakshadweep Quiet Beaches)", "Malanad–Malabar Backwater & Rural Belt",
  "Krishna Heritage Circuit (Mathura–Vrindavan–Dwarka Focus)", "Rishikesh & Haridwar (Himalayan Yoga Route)",
  "Varanasi Ganga Ghats Pilgrimage", "Bodh Gaya Buddhist Circuit Hub", "Rameswaram & Pamban Coast (Sacred Water Walk)",
  "Hampi & Pattadakal (UNESCO Vijayanagara–Chalukya Circuit)", "Gulmarg (Kashmir Ski & Snow Destination)",
  "Auli (Gerhwal Ski & Snow Resort)", "Tiruvannamalai & Arunachala (Inner Fire Journey)",
  "Amarkantak Nature–Spiritual Loop", "Haridwar–Rishikesh–Char Dham Spiritual Trail (Meta‑Circuit Node)"
];

const CITY_PHOTOS = {};
destinations.forEach((dest, i) => {
  const id = ids[i % ids.length];
  CITY_PHOTOS[dest.toLowerCase().trim()] = `https://images.unsplash.com/photo-${id}?w=800&q=80`;
});

// Adding common ones manually just in case
CITY_PHOTOS['delhi'] = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80';
CITY_PHOTOS['mumbai'] = 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80';
CITY_PHOTOS['kochi'] = 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80';

const content = `// Shared photo map for all destinations
export const CITY_PHOTOS: Record<string, string> = ${JSON.stringify(CITY_PHOTOS, null, 2)};

export const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'

export function getCityPhoto(cityName: string = ''): string {
  if (!cityName) return DEFAULT_PHOTO;
  const key = cityName.toLowerCase().trim()
  
  // Try exact match
  if (CITY_PHOTOS[key]) return CITY_PHOTOS[key];
  
  // Try partial match
  const entry = Object.entries(CITY_PHOTOS).find(([k]) => 
    key.includes(k) || k.includes(key)
  );
  
  return entry ? entry[1] : DEFAULT_PHOTO;
}
`;

console.log(content);
