import { Token } from '@/lib/types'
import Image from 'next/image'

interface TokenCardProps {
  token: Token
  showRealTime?: boolean
}

export default function TokenCard({ token, showRealTime = false }: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0
  const priceChangeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const priceChangeIcon = isPositive ? '↑' : '↓'

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {token.image && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
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
            <h3 className="text-lg font-semibold text-white">{token.name}</h3>
            <p className="text-sm text-gray-400">{token.symbol}</p>
          </div>
        </div>
        {token.rank && (
          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
            #{token.rank}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-400 mb-1">Price</p>
          <p className="text-2xl font-bold text-white">
            ${token.price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">24h Change</p>
            <p className={`text-lg font-semibold ${priceChangeColor}`}>
              {priceChangeIcon} {Math.abs(token.priceChange24h).toFixed(2)}%
            </p>
          </div>
          {token.marketCap && (
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Market Cap</p>
              <p className="text-sm text-white">
                ${(token.marketCap / 1e9).toFixed(2)}B
              </p>
            </div>
          )}
        </div>
      </div>

      {showRealTime && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Live updates enabled</p>
        </div>
      )}
    </div>
  )
}

