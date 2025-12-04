import { NextResponse } from 'next/server'
import { fetchCMCPriceHistory } from '@/lib/cmc'

export const revalidate = 3600 // Revalidate every hour (historical data doesn't change frequently)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const days = parseInt(searchParams.get('days') || '30', 10)

    if (!symbol) {
      console.error('[API /prices/history] Missing symbol parameter')
      return NextResponse.json(
        {
          success: false,
          error: 'Missing symbol parameter',
          data: [],
        },
        { status: 400 }
      )
    }

    console.log(`[API /prices/history] Fetching history for ${symbol}, days: ${days}`)
    const history = await fetchCMCPriceHistory(symbol, days)

    if (history.length === 0) {
      console.warn(`[API /prices/history] No history data returned for ${symbol}`)
    } else {
      console.log(`[API /prices/history] Successfully fetched ${history.length} data points for ${symbol}`)
    }

    return NextResponse.json({
      success: history.length > 0,
      data: history,
      count: history.length,
      symbol,
      days,
      message: history.length === 0 ? 'No historical data available for this token' : undefined,
    })
  } catch (error: any) {
    console.error('[API /prices/history] Error:', error.message)
    if (error.stack) {
      console.error('[API /prices/history] Stack:', error.stack)
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch price history',
        data: [],
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

