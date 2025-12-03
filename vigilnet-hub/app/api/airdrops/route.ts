import { NextResponse } from 'next/server'
import { scrapeAirdrops } from '@/lib/scraper'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Revalidate every 10 minutes

export async function GET() {
  try {
    const airdrops = await scrapeAirdrops()

    return NextResponse.json({
      success: true,
      data: airdrops,
      count: airdrops.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/airdrops:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch airdrops',
        data: [],
      },
      { status: 500 }
    )
  }
}

