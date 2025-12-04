import { Suspense } from 'react'
import TokenComparison from '@/components/TokenComparison'

export default function ComparePage({
  searchParams,
}: {
  searchParams: { tokens?: string }
}) {
  const tokenSymbols = searchParams?.tokens
    ? searchParams.tokens.split(',').map((s) => s.trim().toUpperCase())
    : []

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Compare Tokens</h1>
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          <TokenComparison initialSymbols={tokenSymbols} />
        </Suspense>
      </div>
    </div>
  )
}

