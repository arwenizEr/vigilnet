'use client'

import { useState, useEffect } from 'react'
import { Token } from '@/lib/types'

interface WatchlistButtonProps {
  token: Token
}

export default function WatchlistButton({ token }: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
      setIsInWatchlist(watchlist.some((t: Token) => t.id === token.id))
    }
  }, [token.id])

  const toggleWatchlist = () => {
    if (typeof window === 'undefined') return

    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    
    if (isInWatchlist) {
      const updated = watchlist.filter((t: Token) => t.id !== token.id)
      localStorage.setItem('watchlist', JSON.stringify(updated))
      setIsInWatchlist(false)
    } else {
      watchlist.push(token)
      localStorage.setItem('watchlist', JSON.stringify(watchlist))
      setIsInWatchlist(true)
    }
  }

  return (
    <button
      onClick={toggleWatchlist}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isInWatchlist
          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      {isInWatchlist ? '★ In Watchlist' : '☆ Add to Watchlist'}
    </button>
  )
}

