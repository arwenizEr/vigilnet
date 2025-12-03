import { NextResponse } from 'next/server'
import { fetchMultipleRSSFeeds } from '@/lib/rss'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

const CRYPTO_FEEDS = [
  { url: 'https://coinmarketcap.com/headlines/news/rss/', source: 'CoinMarketCap' },
  { url: 'https://coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
]

export async function GET() {
  try {
    // Fetch fresh RSS feeds
    const newsItems = await fetchMultipleRSSFeeds(CRYPTO_FEEDS)

    return NextResponse.json({
      success: true,
      data: newsItems,
      count: newsItems.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/news:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        data: [],
      },
      { status: 500 }
    )
  }
}

