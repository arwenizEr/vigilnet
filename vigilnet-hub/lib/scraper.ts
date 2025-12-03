import axios from 'axios'
import * as cheerio from 'cheerio'
import { Airdrop } from './types'

export async function scrapeAirdrops(): Promise<Airdrop[]> {
  try {
    const response = await axios.get('https://airdrops.io/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const $ = cheerio.load(response.data)
    const airdrops: Airdrop[] = []

    // Scrape airdrop cards/listings
    $('.airdrop-item, .card, article, [class*="airdrop"]').each((index, element) => {
      const $el = $(element)
      
      const title = $el.find('h2, h3, .title, [class*="title"]').first().text().trim()
      const link = $el.find('a').first().attr('href') || ''
      const reward = $el.find('[class*="reward"], .value, .amount').first().text().trim()
      const category = $el.find('[class*="category"], .tag, .badge').first().text().trim()
      const status = $el.find('[class*="status"], .state').first().text().trim()
      const description = $el.find('p, .description, [class*="desc"]').first().text().trim()

      if (title && link) {
        // Make link absolute if relative
        const absoluteLink = link.startsWith('http') 
          ? link 
          : `https://airdrops.io${link.startsWith('/') ? link : '/' + link}`

        airdrops.push({
          id: `airdrop-${index}-${Date.now()}`,
          title,
          link: absoluteLink,
          reward: reward || undefined,
          category: category || undefined,
          status: status || undefined,
          description: description || undefined,
        })
      }
    })

    // Fallback: try to find any links that look like airdrops
    if (airdrops.length === 0) {
      $('a[href*="airdrop"], a[href*="claim"]').each((index, element) => {
        const $el = $(element)
        const title = $el.text().trim() || $el.attr('title') || ''
        const link = $el.attr('href') || ''

        if (title && link) {
          const absoluteLink = link.startsWith('http') 
            ? link 
            : `https://airdrops.io${link.startsWith('/') ? link : '/' + link}`

          airdrops.push({
            id: `airdrop-fallback-${index}-${Date.now()}`,
            title,
            link: absoluteLink,
          })
        }
      })
    }

    return airdrops.slice(0, 50) // Limit to 50 items
  } catch (error) {
    console.error('Error scraping airdrops:', error)
    return []
  }
}

