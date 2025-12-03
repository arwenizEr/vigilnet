import NewsCard from '@/components/NewsCard'
import Pagination from '@/components/Pagination'
import { NewsItem } from '@/lib/types'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

const ITEMS_PER_PAGE = 12

async function getAINews() {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/ai`, {
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    return []
  }
}

export default async function AIPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const news = await getAINews()
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedNews = news.slice(startIndex, endIndex)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI News</h1>
        <p className="text-gray-400">
          Latest artificial intelligence and machine learning news ({news.length} articles)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((item: NewsItem) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No AI news available at the moment.</p>
        </div>
      )}

      {news.length > 0 && (
        <Pagination
          totalItems={news.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
        />
      )}
    </div>
  )
}

