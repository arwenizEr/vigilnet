import { NextResponse } from 'next/server'
import { fetchMultipleRSSFeeds } from '@/lib/rss'
import { prisma } from '@/prisma/client'

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

    // Optionally cache to database (async, don't wait)
    if (newsItems.length > 0 && prisma) {
      Promise.all(
        newsItems.slice(0, 20).map(async (item) => {
          try {
            await prisma.newsCache.upsert({
              where: { link: item.link },
              update: {
                title: item.title,
                pubDate: new Date(item.pubDate),
                content: item.content,
                source: item.source,
              },
              create: {
                title: item.title,
                link: item.link,
                pubDate: new Date(item.pubDate),
                content: item.content,
                source: item.source,
              },
            })
          } catch (error) {
            // Ignore cache errors
          }
        })
      ).catch(() => {})
    }

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

