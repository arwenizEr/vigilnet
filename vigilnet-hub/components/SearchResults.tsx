import { fetchCMCTopTokens } from '@/lib/cmc'
import { fetchMultipleRSSFeeds } from '@/lib/rss'
import { fetchCMCAirdrops } from '@/lib/cmc'
import NewsCard from './NewsCard'
import AirdropCard from './AirdropCard'
import TokenCard from './TokenCard'
import Link from 'next/link'

const CRYPTO_FEEDS = [
  { url: 'https://coinmarketcap.com/headlines/news/rss/', source: 'CoinMarketCap' },
  { url: 'https://coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
]

export default async function SearchResults({ query }: { query: string }) {
  if (!query || query.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please enter a search query</p>
      </div>
    )
  }

  const [tokens, news, airdrops] = await Promise.all([
    fetchCMCTopTokens(200),
    fetchMultipleRSSFeeds(CRYPTO_FEEDS),
    fetchCMCAirdrops(50),
  ])

  const lowerQuery = query.toLowerCase()
  
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(lowerQuery) ||
      token.symbol.toLowerCase().includes(lowerQuery)
  )

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content?.toLowerCase().includes(lowerQuery) ||
      item.source.toLowerCase().includes(lowerQuery)
  )

  const filteredAirdrops = airdrops.filter(
    (airdrop) =>
      airdrop.title.toLowerCase().includes(lowerQuery) ||
      airdrop.description?.toLowerCase().includes(lowerQuery) ||
      airdrop.category?.toLowerCase().includes(lowerQuery)
  )

  const totalResults = filteredTokens.length + filteredNews.length + filteredAirdrops.length

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No results found for &quot;{query}&quot;</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-gray-400">
        Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
      </div>

      {filteredTokens.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Tokens ({filteredTokens.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTokens.slice(0, 12).map((token) => (
              <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
                <TokenCard token={token} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredNews.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">News ({filteredNews.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.slice(0, 12).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}

      {filteredAirdrops.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Airdrops ({filteredAirdrops.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAirdrops.slice(0, 12).map((airdrop) => (
              <AirdropCard key={airdrop.id} airdrop={airdrop} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

