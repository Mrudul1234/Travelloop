<div align="center">

# 🧭 TRAVELOOP
### *India's First AI-Native Travel Architect*

> **Plan smarter. Explore deeper. Travel India like never before.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-travelloop--eta.vercel.app-4F46E5?style=for-the-badge)](https://travelloop-eta.vercel.app/)
[![YouTube](https://img.shields.io/badge/▶_Watch_Demo-YouTube-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/iBX1ICdOFOk?si=fuQ9tXF_Lm_Igd5H)
[![Built For](https://img.shields.io/badge/🏆_OdooxParul_Hackathon-2026-FFD700?style=for-the-badge)](https://travelloop-eta.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini_Pro-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>

---

## 🎯 The Problem We're Solving

> **82% of Indian travelers** spend 6–10 hours manually planning trips across WhatsApp groups, travel blogs, and booking sites — only to end up with generic itineraries that miss local gems.

India has **1.4 billion stories** and **500+ extraordinary destinations**. Most travel apps treat them the same. **Traveloop doesn't.**

---

## ✨ What Makes Traveloop Different

| Feature | Generic Travel Apps | **Traveloop** |
|---|---|---|
| Itinerary Generation | Template-based | 🤖 AI-personalized by Gemini Pro |
| Destination Data | Tourism board copy | 📊 500+ destinations from curated Kaggle dataset |
| India Knowledge | Surface-level | 🇮🇳 Culturally & geographically aware |
| Visuals | Stock photos | 📸 Live Unsplash API per destination |
| Budget Tracking | Separate app needed | 💰 Built-in real-time expense manager |
| UI | Functional | 🎨 Premium Glassmorphism "Sand & Sun" aesthetic |

---

## 📸 Snap Shots



<p align="center">
  <img src="preview-dashboard.png" width="48%" alt="Dashboard" />
  <img src="preview-explore.png" width="48%" alt="Explore Destinations" />
</p>
<p align="center">
  <img src="preview-planner.png" width="48%" alt="AI Trip Planner" />
  <img src="preview-auth.png" width="48%" alt="Authentication" />
</p>

---

## 🤖 Core Features

### 1. AI Trip Architect (Powered by Gemini Pro)
- Generates **personalized day-by-day itineraries** based on travel style, budget, and interests
- Understands India's cultural calendar — avoids suggesting beach trips during monsoon, recommends festival timings
- Outputs time-optimized schedules with travel durations between stops

### 2. Interactive Destination Explorer
- **500+ Indian destinations** across all 28 states & 8 Union Territories
- Filter by category: `Spiritual` · `Heritage` · `Nature` · `Adventure` · `Urban`
- Visual map-based interface — browse like a local, not a tourist

### 3. Smart Budget Manager
- Real-time expense tracking with category tagging (stay / food / transport / experiences)
- Visual spend breakdown against your trip budget
- No more "bhai kitna hua" chaos

### 4. Premium UI/UX
- **"Sand & Sun" Glassmorphism** design language — inspired by Indian textiles and sunlight
- Fully responsive: mobile · tablet · desktop
- Smooth page transitions and micro-interactions throughout

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        TRAVELOOP                            │
├──────────────────────────┬──────────────────────────────────┤
│      FRONTEND             │          BACKEND                 │
│  Next.js 14 App Router   │   Supabase (PostgreSQL + Auth)   │
│  TypeScript               │   Row-Level Security (RLS)       │
│  Tailwind CSS             │   Supabase Storage               │
├──────────────────────────┼──────────────────────────────────┤
│         AI LAYER          │         EXTERNAL APIs            │
│  Google Gemini Pro        │   Unsplash (destination photos)  │
│  Custom prompt templates  │   GeoDB Cities (geo metadata)    │
│  Itinerary generation     │                                  │
├──────────────────────────┴──────────────────────────────────┤
│                    DATA FOUNDATION                           │
│      Kaggle Indian Tourism Dataset → 500+ destinations       │
│      Pre-processed & seeded into Supabase PostgreSQL         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, SEO, performance |
| Language | TypeScript | Type safety, fewer runtime bugs |
| Styling | Tailwind CSS + CSS Variables | Rapid, consistent UI |
| Database | Supabase PostgreSQL | Instant backend with RLS |
| Auth | Supabase Auth | Secure sessions out of the box |
| AI | Google Gemini Pro | Best-in-class Indian context understanding |
| Photos | Unsplash API | High-quality, license-free destination imagery |
| City Data | GeoDB Cities API | Accurate geo + population metadata |
| Hosting | Vercel | Zero-config CI/CD deployment |

---

## 📊 Data: The Foundation of Authenticity

We didn't just build an app — we built a **knowledge base** for Indian travel.

- **Source**: Kaggle Indian Tourism Dataset (manually curated & cleaned)
- **Coverage**: 500+ destinations · All 28 states · 8 Union Territories
- **Categories**: Spiritual, Heritage, Nature, Adventure, Urban, Offbeat
- **Pipeline**: Raw CSV → Data cleaning script → Supabase ingestion → Indexed for fast search

This is what separates Traveloop from a generic AI wrapper — we have **real, structured, India-specific data** powering every recommendation.

---

## 🧠 The AI Behind the Magic

### Gemini Pro Prompt Engineering

We engineered prompts that make Gemini understand India at a cultural level:

```
System Context injected per request:
- Current season + regional weather patterns
- Upcoming festivals (regional, not just national holidays)
- Realistic travel time between cities (not Google Maps optimistic)
- Budget tier (budget / comfort / luxury) with INR-aware suggestions
- User travel style (solo / couple / family / group)
```

This produces itineraries that feel **written by a local**, not generated by a bot.

---

## 🔑 Environment Setup

```bash
# Clone and install
git clone https://github.com/your-username/travelloop.git
cd travelloop
npm install

# Configure environment
cp .env.example .env.local
# Fill in your keys (see table below)

# Run locally
npm run dev
# → http://localhost:3000
```

| Variable | Source | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) | DB + Auth endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Frontend DB access (RLS secured) |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) | AI itinerary generation |
| `UNSPLASH_ACCESS_KEY` | [unsplash.com/developers](https://unsplash.com/oauth/applications) | Destination photography |
| `GEODB_API_KEY` | [rapidapi.com](https://rapidapi.com/wirefreethought/api/geodb-cities) | City metadata |

---

## 📁 Project Structure

```
traveloop/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login / Signup flows
│   ├── dashboard/          # Main user dashboard
│   ├── explore/            # Destination discovery
│   ├── planner/            # AI trip planner
│   └── api/                # Server-side API routes
├── components/             # Reusable UI components
├── lib/
│   ├── supabase/           # DB client + queries
│   ├── gemini/             # AI prompt templates
│   └── utils/              # Helpers
├── public/                 # Static assets + preview images
└── supabase/
    └── migrations/         # DB schema + seed scripts
```

---

## 🌟 What's Next (Post-Hackathon Roadmap)

- [ ] **Offline Mode** — download itineraries as PDF for low-connectivity areas
- [ ] **Social Layer** — share trips, see where others went in the same region
- [ ] **Train/Bus Integration** — IRCTC + KSRTC availability inline with itinerary
- [ ] **Vernacular Support** — Hindi, Gujarati, Tamil itinerary output
- [ ] **Group Budget Splitting** — WhatsApp-style expense sharing built in

---

## 👨‍💻 Team

| Name | Role |
|---|---|
| Mrudul | Full-Stack Development + AI Integration |

---

## 🏆 Built For

**OdooxParul Hackathon 2026** — *AI for Bharat*

---

<div align="center">

**[🚀 Try Live →](https://travelloop-eta.vercel.app/)** &nbsp;&nbsp;&nbsp; **[▶ Watch Demo →](https://youtu.be/iBX1ICdOFOk?si=fuQ9tXF_Lm_Igd5H)**

<br/>

*Made with ❤️ for India's 1.4 billion travel stories*

</div>
