import NewsCard from '@/components/NewsCard'
import AirdropCard from '@/components/AirdropCard'
import TokenSlider from '@/components/TokenSlider'
import AdSlot from '@/components/AdSlot'
import { NewsItem, Token, Airdrop } from '@/lib/types'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

async function getNews() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    return []
  }
}

async function getTokens() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/tokens`, {
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    return []
  }
}


async function getAINews() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/ai`, {
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    return []
  }
}

async function getAirdrops() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/airdrops?limit=12`, {
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    return []
  }
}

export default async function HomePage() {
  const [news, tokens, aiNews, airdrops] = await Promise.all([
    getNews(),
    getTokens(),
    getAINews(),
    getAirdrops(),
  ])

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
              <div className="grid grid-cols-1 gap-4">
                {news.slice(0, 6).map((item: NewsItem) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
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

