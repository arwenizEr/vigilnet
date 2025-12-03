import { NextResponse } from 'next/server'
import { fetchTestnets } from '@/lib/fetchers'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const testnets = await fetchTestnets()

    return NextResponse.json({
      success: true,
      data: testnets,
      count: testnets.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/testnets:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testnets',
        data: [],
      },
      { status: 500 }
    )
  }
}

