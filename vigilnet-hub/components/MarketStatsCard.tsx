import Link from 'next/link'
import { MarketStats } from '@/lib/types'

interface MarketStatsCardProps {
  stats: MarketStats | null
}

export default function MarketStatsCard({ stats }: MarketStatsCardProps) {
  if (!stats) return null

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Market Overview</h2>
        <Link
          href="/analytics"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-700">
        <div>
          <div className="text-gray-400 text-sm mb-1">Total Market Cap</div>
          <div className="text-2xl font-bold text-white">{formatNumber(stats.totalMarketCap)}</div>
          <div className={`text-xs mt-1 ${getChangeColor(stats.marketCapChange24h)}`}>
            {stats.marketCapChange24h >= 0 ? '↑' : '↓'} {Math.abs(stats.marketCapChange24h).toFixed(2)}% (24h)
          </div>
        </div>
        <div className="pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm mb-1">24h Volume</div>
          <div className="text-xl font-bold text-white">{formatNumber(stats.totalVolume24h)}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div>
            <div className="text-gray-400 text-xs mb-1">BTC Dominance</div>
            <div className="text-lg font-bold text-white">{stats.btcDominance.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">ETH Dominance</div>
            <div className="text-lg font-bold text-white">{stats.ethDominance.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </section>
  )
}

