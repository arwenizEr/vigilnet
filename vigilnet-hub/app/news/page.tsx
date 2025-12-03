import NewsCard from '@/components/NewsCard'
import Pagination from '@/components/Pagination'
import { NewsItem } from '@/lib/types'
import { fetchMultipleRSSFeeds } from '@/lib/rss'

const ITEMS_PER_PAGE = 12

// Crypto News RSS feeds
const CRYPTO_FEEDS = [
  { url: 'https://coinmarketcap.com/headlines/news/rss/', source: 'CoinMarketCap' },
  { url: 'https://coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
]

async function getNews(): Promise<NewsItem[]> {
  try {
    console.log('NewsPage: Fetching crypto news from RSS feeds...')
    const newsItems = await fetchMultipleRSSFeeds(CRYPTO_FEEDS)
    console.log(`NewsPage: Successfully fetched ${newsItems.length} news items`)
    return newsItems
  } catch (error) {
    console.error('NewsPage: Error fetching news:', error)
    return []
  }
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const news = await getNews()
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedNews = news.slice(startIndex, endIndex)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Crypto News</h1>
        <p className="text-gray-400">
          Latest cryptocurrency news from top sources ({news.length} articles)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((item: NewsItem) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {news.length === 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
          <p className="text-yellow-400 mb-2">No news available at the moment</p>
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
