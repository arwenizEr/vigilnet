'use client'

import { useState, useEffect } from 'react'
import { Token } from '@/lib/types'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Token[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('watchlist')
      if (stored) {
        setWatchlist(JSON.parse(stored))
      }
    }
  }, [])

  const removeFromWatchlist = (tokenId: string) => {
    const updated = watchlist.filter((t) => t.id !== tokenId)
    setWatchlist(updated)
    localStorage.setItem('watchlist', JSON.stringify(updated))
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-4">My Watchlist</h1>
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">Your watchlist is empty</p>
            <Link href="/tokens" className="text-blue-400 hover:text-blue-300">
              Browse tokens to add to your watchlist →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          <span className="text-gray-400">{watchlist.length} token{watchlist.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((token) => (
            <div key={token.id} className="relative">
              <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
                <TokenCard token={token} />
              </Link>
              <button
                onClick={() => removeFromWatchlist(token.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                title="Remove from watchlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

