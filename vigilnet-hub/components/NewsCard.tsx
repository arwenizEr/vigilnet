'use client'

import { NewsItem } from '@/lib/types'
import Image from 'next/image'
import { useState } from 'react'

interface NewsCardProps {
  news: NewsItem
}

export default function NewsCard({ news }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)
  const date = new Date(news.pubDate)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start space-x-4">
        {news.image && !imageError && (
          <div className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              sizes="96px"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-blue-400">{news.source}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {news.title}
          </h3>
          {news.content && (
            <p className="text-sm text-gray-400 line-clamp-2">{news.content}</p>
          )}
        </div>
      </div>
    </a>
  )
}

