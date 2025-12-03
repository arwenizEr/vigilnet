import { NextResponse } from 'next/server'
import { fetchTokenPrices } from '@/lib/fetchers'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute for real-time updates

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')

    if (!ids) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing ids parameter',
          data: [],
        },
        { status: 400 }
      )
    }

    const coinIds = ids.split(',').filter(Boolean)
    const prices = await fetchTokenPrices(coinIds)

    return NextResponse.json({
      success: true,
      data: prices,
      count: prices.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/prices:', error)
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

