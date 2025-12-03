import AirdropCard from '@/components/AirdropCard'
import Pagination from '@/components/Pagination'
import { Airdrop } from '@/lib/types'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

const ITEMS_PER_PAGE = 12

async function getAirdrops() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/airdrops`, {
      next: { revalidate: 600 },
    })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    return []
  }
}

export default async function AirdropsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const airdrops = await getAirdrops()
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedAirdrops = airdrops.slice(startIndex, endIndex)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Airdrops</h1>
        <p className="text-gray-400">
          Discover active cryptocurrency airdrops ({airdrops.length} airdrops)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedAirdrops.map((airdrop: Airdrop) => (
          <AirdropCard key={airdrop.id} airdrop={airdrop} />
        ))}
      </div>

      {airdrops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No airdrops available at the moment.</p>
        </div>
      )}

      {airdrops.length > 0 && (
        <Pagination
          totalItems={airdrops.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
        />
      )}
    </div>
  )
}

