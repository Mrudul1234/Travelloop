import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Syne, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['500', '700'],
})

export const metadata: Metadata = {
  title: 'TRAVELOOP — Plan Your India Journey',
  description: 'Premium Indian travel planning — create stunning itineraries, track budgets, and explore India in your own style. भारत की यात्रा, अपने अंदाज़ में।',
  keywords: 'India travel, Indian travel planner, trip planning India, itinerary generator, budget travel India',
  openGraph: {
    title: 'TRAVELOOP — Plan Your India Journey',
    description: 'Premium Indian travel planning app. Create beautiful itineraries for Rajasthan, Kerala, Ladakh and beyond.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${dmSans.variable} ${syne.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-dm-sans bg-sand">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#4A2F21',
              color: '#FCE7BB',
              fontFamily: 'var(--font-syne)',
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: {
              style: {
                borderLeft: '4px solid #5D8A5E',
              },
            },
            error: {
              style: {
                borderLeft: '4px solid #C0392B',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
