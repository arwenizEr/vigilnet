import NewsCard from '@/components/NewsCard'
import AirdropCard from '@/components/AirdropCard'
import TokenSlider from '@/components/TokenSlider'
import AdSlot from '@/components/AdSlot'
import { NewsItem, Token, Airdrop } from '@/lib/types'
import { fetchMultipleRSSFeeds } from '@/lib/rss'
import { fetchCMCTopTokens } from '@/lib/cmc'
import { fetchCMCAirdrops } from '@/lib/cmc'

// AI News RSS feeds
const AI_FEEDS = [
  { url: 'https://venturebeat.com/feed/', source: 'VentureBeat' },
  { url: 'https://thenextweb.com/feed', source: 'The Next Web' },
]

// Crypto News RSS feeds
const CRYPTO_FEEDS = [
  { url: 'https://coinmarketcap.com/headlines/news/rss/', source: 'CoinMarketCap' },
  { url: 'https://coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
]

async function getNews(): Promise<NewsItem[]> {
  try {
    console.log('Fetching crypto news from RSS feeds...')
    const newsItems = await fetchMultipleRSSFeeds(CRYPTO_FEEDS)
    console.log(`Successfully fetched ${newsItems.length} news items`)
    return newsItems
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

async function getTokens(): Promise<Token[]> {
  try {
    console.log('Fetching tokens from CoinMarketCap...')
    const tokens = await fetchCMCTopTokens(200)
    console.log(`Successfully fetched ${tokens.length} tokens`)
    return tokens
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return []
  }
}

async function getAINews(): Promise<NewsItem[]> {
  try {
    console.log('Fetching AI news from RSS feeds...')
    const newsItems = await fetchMultipleRSSFeeds(AI_FEEDS)
    console.log(`Successfully fetched ${newsItems.length} AI news items`)
    return newsItems
  } catch (error) {
    console.error('Error fetching AI news:', error)
    return []
  }
}

async function getAirdrops(): Promise<Airdrop[]> {
  try {
    console.log('Fetching airdrops from CoinMarketCap...')
    const airdrops = await fetchCMCAirdrops(12)
    console.log(`Successfully fetched ${airdrops.length} airdrops`)
    return airdrops
  } catch (error) {
    console.error('Error fetching airdrops:', error)
    return []
  }
}

export default async function HomePage() {
  console.log('HomePage: Starting data fetch...')
  
  const [news, tokens, aiNews, airdrops] = await Promise.all([
    getNews(),
    getTokens(),
    getAINews(),
    getAirdrops(),
  ])
  
  console.log(`HomePage: Data fetch complete - News: ${news.length}, Tokens: ${tokens.length}, AI News: ${aiNews.length}, Airdrops: ${airdrops.length}`)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            VigilNet Hub
          </h1>
          <p className="text-xl text-gray-400">
            Real-time crypto & AI content aggregation
          </p>
        </div>

        {/* Trending Tokens Slider */}
        {tokens.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Trending Coins</h2>
              <div className="flex items-center space-x-4">
                <a
                  href="/prices"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All Prices →
                </a>
                <a
                  href="/tokens"
                  className="text-gray-400 hover:text-gray-300 text-sm font-medium"
                >
                  All Tokens ({tokens.length})
                </a>
              </div>
            </div>
            <TokenSlider tokens={tokens.slice(0, 20)} />
          </section>
        )}

        {/* Ad Slot - Top */}
        <div className="mb-8">
          <AdSlot
            adSlotId="top-banner"
            adFormat="horizontal"
            googleAdClient={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
            googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_TOP}
            adNetwork={(process.env.NEXT_PUBLIC_AD_NETWORK as any) || 'google'}
            customAdCode={process.env.NEXT_PUBLIC_CUSTOM_AD_CODE_TOP}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Latest Crypto News */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Latest Crypto News</h2>
                <a
                  href="/news"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All ({news.length}) →
                </a>
              </div>
              {news.length === 0 ? (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
                  <p className="text-yellow-400 mb-2">No news available at the moment</p>
                  <p className="text-yellow-500 text-sm">RSS feeds may be temporarily unavailable. Please check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {news.slice(0, 6).map((item: NewsItem) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              )}
            </section>

            {/* Live Airdrops */}
            {airdrops.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Live Airdrops</h2>
                  <a
                    href="/airdrops"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View All ({airdrops.length}) →
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {airdrops.slice(0, 6).map((airdrop: Airdrop) => (
                    <AirdropCard key={airdrop.id} airdrop={airdrop} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Ad Slot - Sidebar */}
            <AdSlot
              adSlotId="sidebar-banner"
              adFormat="vertical"
              googleAdClient={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
              googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR}
              adNetwork={(process.env.NEXT_PUBLIC_AD_NETWORK as any) || 'google'}
              customAdCode={process.env.NEXT_PUBLIC_CUSTOM_AD_CODE_SIDEBAR}
            />

            {/* Latest AI News */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">AI News</h2>
                <a
                  href="/ai"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All ({aiNews.length}) →
                </a>
              </div>
              <div className="space-y-4">
                {aiNews.slice(0, 6).map((item: NewsItem) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
                  >
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400">{item.source}</p>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Ad Slot - Bottom */}
        <div className="mt-12">
          <AdSlot
            adSlotId="bottom-banner"
            adFormat="horizontal"
            googleAdClient={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
            googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM}
            adNetwork={(process.env.NEXT_PUBLIC_AD_NETWORK as any) || 'google'}
            customAdCode={process.env.NEXT_PUBLIC_CUSTOM_AD_CODE_BOTTOM}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

