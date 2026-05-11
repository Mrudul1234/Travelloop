import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'traveloop_dataset', 'traveloop_dataset', 'india_tourism_dataset.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    // Shuffle and pick 12 interesting ones or just return all
    // Let's return the first 20 for now to keep it fast
    return NextResponse.json(data.slice(0, 100))
  } catch (error) {
    console.error('Failed to read dataset:', error)
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 })
  }
}
