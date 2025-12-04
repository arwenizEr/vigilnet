import { Suspense } from 'react'
import { fetchCMCExchanges } from '@/lib/cmc'
import ExchangesView from '@/components/ExchangesView'
import PageSkeleton from '@/components/PageSkeleton'

async function ExchangesContent() {
  const exchanges = await fetchCMCExchanges(50)
  return <ExchangesView exchanges={exchanges} />
}

export default function ExchangesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ExchangesContent />
    </Suspense>
  )
}

