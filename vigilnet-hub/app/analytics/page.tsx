import { Suspense } from 'react'
import { fetchCMCMarketStats, fetchCMCTopGainersLosers } from '@/lib/cmc'
import MarketAnalyticsView from '@/components/MarketAnalyticsView'
import PageSkeleton from '@/components/PageSkeleton'

async function AnalyticsContent() {
  const [marketStats, gainersLosers] = await Promise.all([
    fetchCMCMarketStats(),
    fetchCMCTopGainersLosers(),
  ])

  return <MarketAnalyticsView stats={marketStats} gainers={gainersLosers.gainers} losers={gainersLosers.losers} />
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  )
}

