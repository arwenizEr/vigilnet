'use client'

import { Token } from '@/lib/types'
import { useState } from 'react'

interface TokenTickerProps {
  tokens: Token[]
}

export default function TokenTicker({ tokens }: TokenTickerProps) {
  const [isPaused, setIsPaused] = useState(false)

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? '↑' : '↓'
  }

  // Show loading message if no tokens
  if (tokens.length === 0) {
    return (
      <div className="bg-yellow-400 py-3 overflow-hidden relative w-full">
        <div className="flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-900 animate-pulse">Loading cryptocurrency prices...</span>
        </div>
      </div>
    )
  }

  // Duplicate tokens multiple times for seamless infinite scroll
  const duplicatedTokens = [...tokens, ...tokens, ...tokens]

  return (
    <div
      className="bg-yellow-400 py-3 overflow-hidden relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex gap-8 whitespace-nowrap ${isPaused ? '' : 'animate-scroll'}`}
      >
        {duplicatedTokens.map((token, index) => (
          <div
            key={`${token.id}-${index}`}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 flex-shrink-0"
          >
            <span className="font-bold">{token.symbol}</span>
            <span>${formatPrice(token.price)}</span>
            <span className={`flex items-center gap-1 font-bold ${getPriceChangeColor(token.priceChange24h)}`}>
              <span>{getPriceChangeIcon(token.priceChange24h)}</span>
              <span>{Math.abs(token.priceChange24h).toFixed(2)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
