import Parser from 'rss-parser'
import { NewsItem } from './types'

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['media:content', 'enclosure'],
  },
})

export async function fetchRSSFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url)
    
    return feed.items.map((item, index) => ({
      id: `${source}-${item.guid || item.link || index}`,
      title: item.title || 'No title',
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString(),
      content: item.contentSnippet || item.content,
      source,
      image: item['media:content']?.['$']?.url || item.enclosure?.url,
    }))
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error)
    return []
  }
}

export async function fetchMultipleRSSFeeds(
  feeds: Array<{ url: string; source: string }>
): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    feeds.map(({ url, source }) => fetchRSSFeed(url, source))
  )

  const allItems: NewsItem[] = []
  
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
    }
  })

  // Sort by date (newest first)
  return allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })
}

