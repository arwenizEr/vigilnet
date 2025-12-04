import { NextResponse } from 'next/server'
import { fetchMultipleRSSFeeds } from '@/lib/rss'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

const AI_FEEDS = [
  { url: 'https://venturebeat.com/category/ai/feed', source: 'VentureBeat AI' },
  { url: 'https://thenextweb.com/feed', source: 'The Next Web' },
]

export async function GET() {
  try {
    const newsItems = await fetchMultipleRSSFeeds(AI_FEEDS)

    // Filter for AI-related content if needed
    const aiNews = newsItems.filter((item) => {
      const titleLower = item.title.toLowerCase()
      const contentLower = (item.content || '').toLowerCase()
      return (
        titleLower.includes('ai') ||
        titleLower.includes('artificial intelligence') ||
        titleLower.includes('machine learning') ||
        titleLower.includes('ml') ||
        contentLower.includes('ai') ||
        contentLower.includes('artificial intelligence')
      )
    })

    return NextResponse.json({
      success: true,
      data: aiNews.length > 0 ? aiNews : newsItems, // Fallback to all if no AI filter matches
      count: aiNews.length > 0 ? aiNews.length : newsItems.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/ai:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI news',
        data: [],
      },
      { status: 500 }
    )
  }
}


