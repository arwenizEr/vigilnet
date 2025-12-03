import { NextResponse } from 'next/server'
import { fetchCMCTopTokens } from '@/lib/cmc'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    const tokens = await fetchCMCTopTokens(limit)

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

