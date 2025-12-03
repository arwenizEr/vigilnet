import NewsCard from '@/components/NewsCard'
import Pagination from '@/components/Pagination'
import { NewsItem } from '@/lib/types'
import { fetchMultipleRSSFeeds } from '@/lib/rss'

const ITEMS_PER_PAGE = 12

// AI News RSS feeds
const AI_FEEDS = [
  { url: 'https://venturebeat.com/feed/', source: 'VentureBeat' },
  { url: 'https://thenextweb.com/feed', source: 'The Next Web' },
]

async function getAINews(): Promise<NewsItem[]> {
  try {
    console.log('AIPage: Fetching AI news from RSS feeds...')
    const newsItems = await fetchMultipleRSSFeeds(AI_FEEDS)
    
    // Filter for AI-related content
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
    
    // Use filtered AI news if available, otherwise use all news
    const result = aiNews.length > 0 ? aiNews : newsItems
    console.log(`AIPage: Successfully fetched ${result.length} AI news items (${aiNews.length} filtered from ${newsItems.length} total)`)
    return result
  } catch (error) {
    console.error('AIPage: Error fetching AI news:', error)
    return []
  }
}

export default async function AIPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const news = await getAINews()
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedNews = news.slice(startIndex, endIndex)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI News</h1>
        <p className="text-gray-400">
          Latest artificial intelligence and machine learning news ({news.length} articles)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((item: NewsItem) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {news.length === 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
          <p className="text-yellow-400 mb-2">No AI news available at the moment</p>
          <p className="text-yellow-500 text-sm">RSS feeds may be temporarily unavailable. Please check back later.</p>
        </div>
      )}

      {news.length > 0 && (
        <Pagination
          totalItems={news.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
        />
      )}
    </div>
  )
}

