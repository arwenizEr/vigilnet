import { NextResponse } from 'next/server'
import { fetchCMCTokenDetail } from '@/lib/cmc'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const token = await fetchCMCTokenDetail(params.symbol)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: token })
  } catch (error: any) {
    console.error('Error fetching token:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

