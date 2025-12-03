'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AirdropCard from '@/components/AirdropCard'
import Pagination from '@/components/Pagination'
import { Airdrop } from '@/lib/types'

const ITEMS_PER_PAGE = 12

function AirdropsContent() {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams?.get('page') || '1', 10)
  const [airdrops, setAirdrops] = useState<Airdrop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paginatedAirdrops = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return airdrops.slice(startIndex, endIndex)
  }, [airdrops, currentPage])

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        setError(null)
        const res = await fetch('/api/airdrops?limit=100')
        const data = await res.json()

        if (data.success) {
          setAirdrops(data.data)
        } else {
          setError('Failed to fetch airdrops')
        }
      } catch (err) {
        console.error('Error fetching airdrops:', err)
        setError('Failed to fetch airdrops')
      } finally {
        setLoading(false)
      }
    }

    fetchAirdrops()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading airdrops...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cryptocurrency Airdrops</h1>
          <p className="text-gray-400">
            Discover active and upcoming cryptocurrency airdrops ({airdrops.length} available)
          </p>
        </div>

        {airdrops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No airdrops available at the moment.</p>
            <p className="text-sm text-gray-500">
              Make sure you have a CoinMarketCap API key configured to view airdrops.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedAirdrops.map((airdrop) => (
                <AirdropCard key={airdrop.id} airdrop={airdrop} />
              ))}
            </div>

            {airdrops.length > ITEMS_PER_PAGE && (
              <Pagination
                totalItems={airdrops.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function AirdropsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <p className="text-gray-400">Loading airdrops...</p>
            </div>
          </div>
        </div>
      }
    >
      <AirdropsContent />
    </Suspense>
  )
}

