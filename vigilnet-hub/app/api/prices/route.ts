import { NextResponse } from 'next/server'
import { fetchCMCPrices } from '@/lib/cmc'

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

    const symbols = ids.split(',').filter(Boolean).map(s => s.toUpperCase())
    const priceMap = await fetchCMCPrices(symbols)
    
    // Convert Map to PriceUpdate array format
    const prices = Array.from(priceMap.entries()).map(([symbol, price]) => ({
      coinId: symbol.toLowerCase(),
      symbol: symbol.toUpperCase(),
      price,
      priceChange24h: 0, // Will be updated from full token data if available
      timestamp: Date.now(),
    }))

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

