'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MarketStats, Token } from '@/lib/types'

interface MarketAnalyticsViewProps {
  stats: MarketStats | null
  gainers: Token[]
  losers: Token[]
}

export default function MarketAnalyticsView({ stats, gainers, losers }: MarketAnalyticsViewProps) {
  const formatNumber = (num: number | undefined) => {
    if (!num || num === 0) return 'N/A'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatMarketCap = (num: number | undefined | null) => {
    if (num === undefined || num === null) return 'N/A'
    if (num === 0) return '$0'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? '↑' : '↓'
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Market Analytics</h1>

        {/* Market Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Market Cap</div>
              <div className="text-3xl font-bold text-white">{formatNumber(stats.totalMarketCap)}</div>
              <div className={`text-sm mt-2 ${getPriceChangeColor(stats.marketCapChange24h)}`}>
                {getPriceChangeIcon(stats.marketCapChange24h)} {Math.abs(stats.marketCapChange24h).toFixed(2)}% (24h)
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">24h Volume</div>
              <div className="text-3xl font-bold text-white">{formatNumber(stats.totalVolume24h)}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">BTC Dominance</div>
              <div className="text-3xl font-bold text-white">{stats.btcDominance.toFixed(2)}%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">ETH Dominance</div>
              <div className="text-3xl font-bold text-white">{stats.ethDominance.toFixed(2)}%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Active Cryptocurrencies</div>
              <div className="text-3xl font-bold text-white">{stats.activeCryptocurrencies.toLocaleString('en-US')}</div>
            </div>
          </div>
        )}

        {/* Top Gainers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Top Gainers (24h)</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">24h Change</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {gainers.map((token, index) => (
                    <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4">
                        <Link href={`/tokens/${token.symbol.toLowerCase()}`} className="flex items-center space-x-3">
                          {token.image && (
                            <Image src={token.image} alt={token.name} width={32} height={32} className="rounded-full" />
                          )}
                          <div>
                            <div className="font-semibold text-white">{token.name}</div>
                            <div className="text-sm text-gray-400">{token.symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right text-white">
                        ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${getPriceChangeColor(token.priceChange24h)}`}>
                        {getPriceChangeIcon(token.priceChange24h)} {Math.abs(token.priceChange24h).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">{formatMarketCap(token.marketCap)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Top Losers (24h)</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">24h Change</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {losers.map((token, index) => (
                    <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4">
                        <Link href={`/tokens/${token.symbol.toLowerCase()}`} className="flex items-center space-x-3">
                          {token.image && (
                            <Image src={token.image} alt={token.name} width={32} height={32} className="rounded-full" />
                          )}
                          <div>
                            <div className="font-semibold text-white">{token.name}</div>
                            <div className="text-sm text-gray-400">{token.symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right text-white">
                        ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${getPriceChangeColor(token.priceChange24h)}`}>
                        {getPriceChangeIcon(token.priceChange24h)} {Math.abs(token.priceChange24h).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">{formatMarketCap(token.marketCap)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

