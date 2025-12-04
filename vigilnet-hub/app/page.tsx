import NewsCard from '@/components/NewsCard'
import AirdropCard from '@/components/AirdropCard'
import TokenSlider from '@/components/TokenSlider'
import MarketStatsCard from '@/components/MarketStatsCard'
import { NewsItem, Token, Airdrop } from '@/lib/types'
import { fetchMultipleRSSFeeds } from '@/lib/rss'
import { fetchCMCTopTokens, fetchCMCMarketStats, fetchCMCTopGainersLosers } from '@/lib/cmc'
import { fetchCMCAirdrops } from '@/lib/cmc'

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
  
  const [news, tokens, airdrops, marketStats, gainersLosers] = await Promise.all([
    getNews(),
    getTokens(),
    getAirdrops(),
    fetchCMCMarketStats(),
    fetchCMCTopGainersLosers(),
  ])
  
  console.log(`HomePage: Data fetch complete - News: ${news.length}, Tokens: ${tokens.length}, Airdrops: ${airdrops.length}`)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            VigilNet Hub
          </h1>
          <p className="text-xl text-gray-400">
            Real-time crypto market data & news aggregation
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
            {/* Market Stats */}
            {marketStats && (
              <MarketStatsCard stats={marketStats} />
            )}

            {/* Top Gainers */}
            {gainersLosers.gainers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Top Gainers (24h)</h2>
                  <a
                    href="/analytics"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View All →
                  </a>
                </div>
                <div className="space-y-3">
                  {gainersLosers.gainers.slice(0, 5).map((token: Token) => (
                    <a
                      key={token.id}
                      href={`/tokens/${token.symbol.toLowerCase()}`}
                      className="block bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {token.image && (
                            <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white">{token.symbol}</div>
                            <div className="text-xs text-gray-400">{token.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-400 tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <span>↑</span>
                              <span className="font-mono">{token.priceChange24h.toFixed(2)}%</span>
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                          </div>
                          {token.marketCap && (
                            <div className="text-xs text-gray-500 mt-1">
                              {token.marketCap >= 1e9
                                ? `$${(token.marketCap / 1e9).toFixed(2)}B`
                                : token.marketCap >= 1e6
                                ? `$${(token.marketCap / 1e6).toFixed(2)}M`
                                : `$${token.marketCap.toLocaleString('en-US')}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Top Losers */}
            {gainersLosers.losers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Top Losers (24h)</h2>
                  <a
                    href="/analytics"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View All →
                  </a>
                </div>
                <div className="space-y-3">
                  {gainersLosers.losers.slice(0, 5).map((token: Token) => (
                    <a
                      key={token.id}
                      href={`/tokens/${token.symbol.toLowerCase()}`}
                      className="block bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {token.image && (
                            <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white">{token.symbol}</div>
                            <div className="text-xs text-gray-400">{token.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-400 tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <span>↓</span>
                              <span className="font-mono">{Math.abs(token.priceChange24h).toFixed(2)}%</span>
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                          </div>
                          {token.marketCap && (
                            <div className="text-xs text-gray-500 mt-1">
                              {token.marketCap >= 1e9
                                ? `$${(token.marketCap / 1e9).toFixed(2)}B`
                                : token.marketCap >= 1e6
                                ? `$${(token.marketCap / 1e6).toFixed(2)}M`
                                : `$${token.marketCap.toLocaleString('en-US')}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

