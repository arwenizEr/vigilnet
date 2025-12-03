import { NextResponse } from 'next/server'
import { fetchCMCTopTokens } from '@/lib/cmc'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '200', 10)
    // CoinMarketCap API - cap at 200 for safety
    const safeLimit = Math.min(limit, 200)

    const tokens = await fetchCMCTopTokens(safeLimit)

    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/prices/all:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prices',
        data: [],
      },
      { status: 500 }
    )
  }
}

