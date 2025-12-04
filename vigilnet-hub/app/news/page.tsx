import Pagination from '@/components/Pagination'
import { NewsItem } from '@/lib/types'
import { fetchMultipleRSSFeeds } from '@/lib/rss'
import NewsFilters from '@/components/NewsFilters'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Crypto News</h1>
        <p className="text-gray-400">
          Latest cryptocurrency news from top sources ({news.length} articles)
        </p>
      </div>

      <NewsFilters news={news} />

      {news.length === 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
          <p className="text-yellow-400 mb-2">No news available at the moment</p>
          <p className="text-yellow-500 text-sm">RSS feeds may be temporarily unavailable. Please check back later.</p>
        </div>
      )}

    </div>
  )
}
