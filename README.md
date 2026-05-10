# 🏯 TRAVELOOP — Heritage Editorial Travel Planner

**TRAVELOOP** is a premium Indian travel planning application built for the modern explorer. It blends high-fidelity modern UI with a "Heritage Editorial" aesthetic inspired by Mughal architecture and Indian earth-tone palettes.

![Preview](https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80)

## ✨ Features

- **14 Core Screens**: Fully implemented from Auth to Itinerary Building.
- **AI Itinerary Generator**: Powered by Gemini AI for context-aware travel suggestions.
- **Heritage Design System**: Earth-tone palettes (Sand, Sun, Earth, Deep) with Jali dividers and Mandala watermarks.
- **Trip Builder**: Interactive stop management with activity tracking.
- **Budget & Checklist**: Full-stack integration for expense management and packing lists.
- **Supabase Integration**: Robust real-time data persistence with RLS policies.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database/Auth**: Supabase
- **AI**: Google Gemini API
- **APIs**: Unsplash (Photos), GeoDB (Cities)

## 🛠️ Setup

1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Configure Environment**: Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   GEMINI_API_KEY=your_key
   UNSPLASH_ACCESS_KEY=your_key
   GEODB_API_KEY=your_key
   ```
4. **Database Schema**: Apply the SQL from `scripts/schema.sql` in your Supabase SQL editor.
5. **Run**: `npm run dev`

---

*भारत की यात्रा, अपने अंदाज़ में। (India's journey, in your style.)*

**Build Version**: 1.0.1 (Fixed Badge Types - 2026-05-10)
