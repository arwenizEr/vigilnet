'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

export default function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            )
          }
          
          const pageNum = page as number
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>
      
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  )
}

