'use client'

import { Token } from '@/lib/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface TokenTableProps {
  tokens: Token[]
}

export default function TokenTable({ tokens }: TokenTableProps) {
  const router = useRouter()

  const handleRowClick = (symbol: string) => {
    router.push(`/tokens/${symbol.toLowerCase()}`)
  }

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
  }

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A'
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A'
    if (volume >= 1e12) return `$${(volume / 1e12).toFixed(2)}T`
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    return `$${volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return 'N/A'
    return `${Math.abs(value).toFixed(2)}%`
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? '↑' : '↓'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800/50">
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">1h</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">24h</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">7d</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Volume 24h</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr
              key={token.id}
              onClick={() => handleRowClick(token.symbol)}
              className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
            >
              <td className="py-4 px-6">
                <span className="text-gray-500 text-sm font-medium">{token.rank || index + 1}</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  {token.image && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={token.image}
                        alt={token.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-white">{token.name}</div>
                    <div className="text-sm text-gray-400">{token.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-right">
                <span className="text-white font-semibold text-base">
                  ${formatPrice(token.price)}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className={`font-semibold text-sm ${getPriceChangeColor(token.priceChange1h || 0)}`}>
                  <span className="inline-flex items-center justify-end gap-1 tabular-nums">
                    <span>{getPriceChangeIcon(token.priceChange1h || 0)}</span>
                    <span className="font-mono">{formatPercentage(token.priceChange1h)}</span>
                  </span>
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className={`font-semibold text-sm ${getPriceChangeColor(token.priceChange24h)}`}>
                  <span className="inline-flex items-center justify-end gap-1 tabular-nums">
                    <span>{getPriceChangeIcon(token.priceChange24h)}</span>
                    <span className="font-mono">{formatPercentage(token.priceChange24h)}</span>
                  </span>
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className={`font-semibold text-sm ${getPriceChangeColor(token.priceChange7d || 0)}`}>
                  <span className="inline-flex items-center justify-end gap-1 tabular-nums">
                    <span>{getPriceChangeIcon(token.priceChange7d || 0)}</span>
                    <span className="font-mono">{formatPercentage(token.priceChange7d)}</span>
                  </span>
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className="text-gray-300 text-sm font-medium">
                  {formatVolume(token.volume24h)}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className="text-gray-300 text-sm font-medium">
                  {formatMarketCap(token.marketCap)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

