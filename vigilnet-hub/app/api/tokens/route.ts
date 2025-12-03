import { NextResponse } from 'next/server'
import { fetchCMCTopTokens } from '@/lib/cmc'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET() {
  try {
    const tokens = await fetchCMCTopTokens(200)

    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/tokens:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tokens',
        data: [],
      },
      { status: 500 }
    )
  }
}

