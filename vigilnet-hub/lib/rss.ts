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
    console.log(`Fetching RSS feed: ${source} from ${url}`)
    const feed = await parser.parseURL(url)
    
    if (!feed || !feed.items || feed.items.length === 0) {
      console.warn(`No items found in RSS feed from ${source} (${url})`)
      return []
    }
    
    const items = feed.items.map((item, index) => ({
      id: `${source}-${item.guid || item.link || index}`,
      title: item.title || 'No title',
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString(),
      content: item.contentSnippet || item.content,
      source,
      image: item['media:content']?.['$']?.url || item.enclosure?.url,
    }))
    
    console.log(`Successfully fetched ${items.length} items from ${source}`)
    return items
  } catch (error: any) {
    console.error(`Error fetching RSS feed from ${source} (${url}):`, error?.message || error)
    if (error?.response) {
      console.error(`HTTP Status: ${error.response.status}`)
    }
    return []
  }
}

export async function fetchMultipleRSSFeeds(
  feeds: Array<{ url: string; source: string }>
): Promise<NewsItem[]> {
  console.log(`Fetching ${feeds.length} RSS feeds...`)
  
  const results = await Promise.allSettled(
    feeds.map(({ url, source }) => fetchRSSFeed(url, source))
  )

  const allItems: NewsItem[] = []
  let successCount = 0
  let failureCount = 0
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
      successCount++
    } else {
      console.error(`Failed to fetch feed ${feeds[index].source}:`, result.reason)
      failureCount++
    }
  })

  console.log(`RSS fetch complete: ${successCount} succeeded, ${failureCount} failed, ${allItems.length} total items`)

  // Sort by date (newest first)
  const sorted = allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })
  
  return sorted
}

