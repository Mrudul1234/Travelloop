# ⛺️ TRAVELOOP
### *Experience India's Heritage, One Curated Itinerary at a Time.*

[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🚀 Hackathon Vision
Most travel planners are generic. **TRAVELLOOP** is different. We built a **Heritage-First** travel ecosystem specifically designed for the Indian landscape. By blending modern AI intelligence with a "Heritage Modern" aesthetic, we've created a tool that feels as premium as the destinations it explores.

## ✨ Key Features

### 🧠 1. AI-Powered "Heritage" Itineraries
Our custom-tuned AI engine doesn't just list places; it crafts **cultural narratives**. It generates day-by-day plans for Indian cities (Jaipur, Udaipur, Kerala, etc.) with a focus on local experiences, timings, and budget accuracy.
- **Fail-Safe Mode**: Built-in triple-redundancy ensures you get a plan even if the AI is offline.

### 🗺️ 2. Interactive Geo-Picker
Forget typing city names. Our interactive Map UI (Leaflet-powered) allows users to physically tap through the geography of India to select their stops. It's visual, intuitive, and fun.

### 💰 3. Real-Time Budget Guardian
Travel in India varies from budget backpacker to royal luxury. Our budget tracker allows real-time expense logging with categorized spending (Food, Stay, Transport) and instant balance calculation.

### 📸 4. Dynamic Destination Imagery
The app feels alive. Every trip you create automatically pulls stunning high-fidelity photography for that specific city. If you plan a trip to Udaipur, your dashboard becomes Udaipur.

### 📱 5. Mobile-First Heritage UI
Designed with a "Heritage Modern" design system:
- **Mandala Watermarks**: Subtle cultural motifs.
- **Gold & Earth Palette**: Reflecting the vibrant colors of India.
- **Glassmorphism**: Modern tech feel with a traditional soul.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Intelligence**: Google Gemini 1.5 Flash API
- **Visuals**: Unsplash Developer API, Leaflet.js
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel

---

## ⚙️ Setup & Installation

### 1. Database Setup (Supabase)
Run the following SQL in your Supabase Editor to create the necessary schema:
```sql
-- See scripts/schema.sql for the full database structure
-- Crucial tables: trips, stops, activities, expenses, profiles
```

### 2. Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_google_ai_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

### 3. Run Locally
```bash
npm install
npm run dev
```

---

## 🏆 Hackathon Goal
Our goal was to solve the "Generic Travel" problem by creating an app that respects the specific cultural and geographical nuances of India. **Travelloop** is not just an app; it's a digital companion for the modern Indian explorer.

---

## 📄 License
MIT License. Created with ❤️ for the Indian travel community.
