import { NextResponse } from 'next/server'
import { fetchCMCAirdrops } from '@/lib/cmc'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const safeLimit = Math.min(limit, 100)

    const airdrops = await fetchCMCAirdrops(safeLimit)

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

