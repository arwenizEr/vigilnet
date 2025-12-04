'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TokenTable from '@/components/TokenTable'
import Pagination from '@/components/Pagination'
import { Token, PriceUpdate } from '@/lib/types'

const ITEMS_PER_PAGE = 50

function TokensContent() {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams?.get('page') || '1', 10)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const paginatedTokens = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return tokens.slice(startIndex, endIndex)
  }, [tokens, currentPage])

  const fetchTokens = async () => {
    try {
      const res = await fetch('/api/tokens')
      const data = await res.json()
      if (data.success) {
        setTokens(data.data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePrices = async () => {
    if (tokens.length === 0) return

    try {
      const coinIds = tokens.map((t) => t.coinId).join(',')
      const res = await fetch(`/api/prices?ids=${coinIds}`)
      const data = await res.json()

      if (data.success && Array.isArray(data.data)) {
        const priceMap = new Map<string, PriceUpdate>()
        data.data.forEach((p: PriceUpdate) => {
          if (p && p.coinId && typeof p.price === 'number' && typeof p.priceChange24h === 'number') {
            priceMap.set(p.coinId, p)
          }
        })

        setTokens((prev) =>
          prev.map((token) => {
            const update = priceMap.get(token.coinId)
            if (update) {
              return {
                ...token,
                price: update.price,
                priceChange24h: update.priceChange24h,
              }
            }
            return token
          })
        )
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error updating prices:', error)
    }
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  useEffect(() => {
    if (tokens.length > 0) {
      // Update prices every 30 seconds
      const interval = setInterval(updatePrices, 30000)
      return () => clearInterval(interval)
    }
  }, [tokens.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="h-8 w-64 bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 border-b border-gray-700 bg-gray-800"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trending Tokens</h1>
            <p className="text-gray-400">
              Real-time cryptocurrency prices and trends ({tokens.length} tokens)
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm text-gray-400">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
          <TokenTable tokens={paginatedTokens} />
        </div>

        {tokens.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">No tokens available at the moment.</p>
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
    </div>
  )
}

export default function TokensPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="h-8 w-64 bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-96 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 border-b border-gray-700 bg-gray-800"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <TokensContent />
    </Suspense>
  )
}

