'use client'

import { NewsItem } from '@/lib/types'
import { useState, useMemo } from 'react'
import NewsCard from './NewsCard'

interface NewsFiltersProps {
  news: NewsItem[]
}

export default function NewsFilters({ news }: NewsFiltersProps) {
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'source'>('date')

  const sources = useMemo(() => {
    const uniqueSources = Array.from(new Set(news.map((item) => item.source)))
    return uniqueSources.sort()
  }, [news])

  const filteredAndSorted = useMemo(() => {
    let filtered = news

    if (selectedSource !== 'all') {
      filtered = filtered.filter((item) => item.source === selectedSource)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      } else {
        return a.source.localeCompare(b.source)
      }
    })

    return sorted
  }, [news, selectedSource, sortBy])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-gray-400 text-sm">Filter by source:</label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-400 text-sm">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'source')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date (Newest First)</option>
            <option value="source">Source (A-Z)</option>
          </select>
        </div>

        <div className="text-gray-400 text-sm">
          Showing {filteredAndSorted.length} of {news.length} articles
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  )
}

