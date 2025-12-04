import { Suspense } from 'react'
import { fetchCMCDefiProtocols } from '@/lib/cmc'
import DeFiView from '@/components/DeFiView'
import PageSkeleton from '@/components/PageSkeleton'

async function DeFiContent() {
  const protocols = await fetchCMCDefiProtocols(50)
  return <DeFiView protocols={protocols} />
}

export default function DeFiPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DeFiContent />
    </Suspense>
  )
}

