'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import TokenCard from '@/components/TokenCard'
import Pagination from '@/components/Pagination'
import { Token } from '@/lib/types'

const ITEMS_PER_PAGE = 12

export default function PricesPage() {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams?.get('page') || '1', 10)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)

  const paginatedTokens = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return tokens.slice(startIndex, endIndex)
  }, [tokens, currentPage])

  const fetchPrices = async () => {
    try {
      setError(null)
      const res = await fetch('/api/prices/all?limit=200')
      const data = await res.json()
      
      if (data.success) {
        setTokens(data.data)
        setLastUpdate(new Date())
      } else {
        setError('Failed to fetch prices')
      }
    } catch (err) {
      console.error('Error fetching prices:', err)
      setError('Failed to fetch prices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    
    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading cryptocurrency prices...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchPrices}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real-time Prices</h1>
          <p className="text-gray-400">
            Live cryptocurrency prices and market data ({tokens.length} tokens)
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm text-gray-400">
            {lastUpdate.toLocaleTimeString()}
          </p>
          <p className="text-xs text-green-400 mt-1">● Live</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTokens.map((token) => (
          <TokenCard key={token.id} token={token} showRealTime />
        ))}
      </div>

      {tokens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No price data available at the moment.</p>
        </div>
      )}

      {tokens.length > 0 && (
        <Pagination
          totalItems={tokens.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
        />
      )}
    </div>
  )
}

