'use client'

import { Token } from '@/lib/types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface TokenSliderProps {
  tokens: Token[]
}

export default function TokenSlider({ tokens }: TokenSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [tokens])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })
    }
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
      maximumFractionDigits: 6,
    })
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? '↑' : '↓'
  }

  if (tokens.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 rounded-full p-2 shadow-lg border border-gray-700 transition-all"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tokens.map((token) => (
          <div
            key={token.id}
            className="flex-shrink-0 w-64 bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {token.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={token.image}
                      alt={token.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-white">{token.name}</h3>
                  <p className="text-xs text-gray-400">{token.symbol}</p>
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
                <p className="text-xs text-gray-400 mb-1">Price</p>
                <p className="text-lg font-bold text-white">${formatPrice(token.price)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">24h Change</p>
                  <p className={`text-sm font-semibold ${getPriceChangeColor(token.priceChange24h)}`}>
                    {getPriceChangeIcon(token.priceChange24h)}{' '}
                    {Math.abs(token.priceChange24h).toFixed(2)}%
                  </p>
                </div>
                {token.marketCap && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Market Cap</p>
                    <p className="text-xs text-white">
                      {token.marketCap >= 1e12
                        ? `$${(token.marketCap / 1e12).toFixed(2)}T`
                        : token.marketCap >= 1e9
                        ? `$${(token.marketCap / 1e9).toFixed(2)}B`
                        : token.marketCap >= 1e6
                        ? `$${(token.marketCap / 1e6).toFixed(2)}M`
                        : `$${token.marketCap.toLocaleString()}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 rounded-full p-2 shadow-lg border border-gray-700 transition-all"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

    </div>
  )
}

