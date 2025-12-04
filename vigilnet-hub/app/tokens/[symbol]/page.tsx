import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { fetchCMCTokenDetail } from '@/lib/cmc'
import TokenDetailView from '@/components/TokenDetailView'
import TokenDetailSkeleton from '@/components/TokenDetailSkeleton'
import { fetchMultipleRSSFeeds } from '@/lib/rss'

const CRYPTO_FEEDS = [
  { url: 'https://coinmarketcap.com/headlines/news/rss/', source: 'CoinMarketCap' },
  { url: 'https://coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
]

async function TokenDetailContent({ symbol }: { symbol: string }) {
  const [token, news] = await Promise.all([
    fetchCMCTokenDetail(symbol),
    fetchMultipleRSSFeeds(CRYPTO_FEEDS),
  ])

  if (!token) {
    notFound()
  }

  // Filter news related to this token
  const relatedNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(token.name.toLowerCase()) ||
      item.title.toLowerCase().includes(token.symbol.toLowerCase()) ||
      item.content?.toLowerCase().includes(token.name.toLowerCase()) ||
      item.content?.toLowerCase().includes(token.symbol.toLowerCase())
  ).slice(0, 6)

  return <TokenDetailView token={token} relatedNews={relatedNews} />
}

export default async function TokenDetailPage({
  params,
}: {
  params: { symbol: string }
}) {
  const symbol = params.symbol.toUpperCase()

  return (
    <Suspense fallback={<TokenDetailSkeleton />}>
      <TokenDetailContent symbol={symbol} />
    </Suspense>
  )
}

