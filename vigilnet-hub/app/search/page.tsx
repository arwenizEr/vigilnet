import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams?.q || ''

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Search Results</h1>
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  )
}

