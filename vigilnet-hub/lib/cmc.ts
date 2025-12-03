import axios from 'axios'
import * as cheerio from 'cheerio'
import { Token, Airdrop } from './types'

const CMC_API = 'https://pro-api.coinmarketcap.com/v1'
const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY || '5296e9f5679948df9e97e25172a2be36'

export interface CMCToken {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  quote: {
    USD: {
      price: number
      volume_24h: number
      percent_change_1h: number
      percent_change_24h: number
      percent_change_7d: number
      market_cap: number
    }
  }
}

// Use CoinMarketCap API for prices
export async function fetchCMCTopTokens(limit: number = 200): Promise<Token[]> {
  if (!CMC_API_KEY) {
    console.warn('CoinMarketCap API key not configured')
    return []
  }

  try {
    const response = await axios.get(`${CMC_API}/cryptocurrency/listings/latest`, {
      params: {
        start: 1,
        limit,
        convert: 'USD',
        sort: 'market_cap',
        sort_dir: 'desc',
      },
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 15000,
    })

    if (response.data && response.data.data) {
      return response.data.data.map((token: CMCToken) => ({
        id: `cmc-${token.id}`,
        name: token.name,
        symbol: token.symbol,
        price: token.quote.USD.price,
        priceChange24h: token.quote.USD.percent_change_24h,
        priceChange1h: token.quote.USD.percent_change_1h,
        priceChange7d: token.quote.USD.percent_change_7d,
        volume24h: token.quote.USD.volume_24h,
        marketCap: token.quote.USD.market_cap,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.id}.png`,
        rank: token.cmc_rank,
        coinId: token.slug,
      }))
    }
    return []
  } catch (error: any) {
    console.error('Error fetching from CoinMarketCap API:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    return []
  }
}

export async function fetchCMCPrices(symbols: string[]): Promise<Map<string, number>> {
  if (!CMC_API_KEY) {
    return new Map()
  }

  try {
    const response = await axios.get(`${CMC_API}/cryptocurrency/quotes/latest`, {
      params: {
        symbol: symbols.join(','),
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 10000,
    })

    if (response.data && response.data.data) {
      const priceMap = new Map<string, number>()
      Object.values(response.data.data).forEach((token: any) => {
        if (token.quote && token.quote.USD && token.quote.USD.price) {
          priceMap.set(token.symbol, token.quote.USD.price)
        }
      })
      return priceMap
    }
    return new Map()
  } catch (error: any) {
    console.error('Error fetching prices from CoinMarketCap:', error.message)
    return new Map()
  }
}

// Scrape CoinMarketCap airdrops page
export async function fetchCMCAirdrops(limit: number = 50): Promise<Airdrop[]> {
  try {
    const response = await axios.get('https://coinmarketcap.com/airdrop/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    const $ = cheerio.load(response.data)
    const airdrops: Airdrop[] = []

    // Try to find airdrop data in the page
    // CoinMarketCap might load airdrops via JavaScript, so we'll look for common patterns
    $('table tbody tr, [class*="airdrop"], [data-testid*="airdrop"]').each((index: number, element: any) => {
      const $el = $(element)
      
      // Try to extract airdrop information
      const projectName = $el.find('td:first-child, [class*="project"], [class*="name"]').first().text().trim()
      const participants = $el.find('[class*="participant"]').text().trim()
      const rewards = $el.find('[class*="reward"], [class*="pool"]').text().trim()
      const started = $el.find('[class*="start"], [class*="date"]').first().text().trim()
      const ended = $el.find('[class*="end"], [class*="date"]').last().text().trim()
      const status = $el.find('[class*="status"]').text().trim()
      const link = $el.find('a').first().attr('href') || ''

      if (projectName && projectName !== 'Loading data...') {
        const absoluteLink = link.startsWith('http') 
          ? link 
          : link.startsWith('/')
          ? `https://coinmarketcap.com${link}`
          : `https://coinmarketcap.com/airdrop/${link}`

        airdrops.push({
          id: `cmc-airdrop-${index}-${Date.now()}`,
          title: projectName,
          link: absoluteLink || 'https://coinmarketcap.com/airdrop/',
          reward: rewards || undefined,
          category: participants ? `Participants: ${participants}` : undefined,
          status: status || (ended ? 'Ended' : started ? 'Active' : 'Upcoming'),
          description: started && ended ? `Started: ${started}, Ended: ${ended}` : started ? `Started: ${started}` : undefined,
        })
      }
    })

    // If no table data found, try to find airdrop cards or sections
    if (airdrops.length === 0) {
      $('[class*="airdrop-card"], [class*="campaign"], article').each((index: number, element: any) => {
        const $el = $(element)
        const title = $el.find('h2, h3, h4, [class*="title"], [class*="name"]').first().text().trim()
        const link = $el.find('a').first().attr('href') || ''
        const description = $el.find('p, [class*="description"], [class*="desc"]').first().text().trim()

        if (title && title.length > 3) {
          const absoluteLink = link.startsWith('http') 
            ? link 
            : link.startsWith('/')
            ? `https://coinmarketcap.com${link}`
            : `https://coinmarketcap.com/airdrop/`

          airdrops.push({
            id: `cmc-airdrop-card-${index}-${Date.now()}`,
            title,
            link: absoluteLink,
            description: description || undefined,
            status: 'Active',
          })
        }
      })
    }

    return airdrops.slice(0, limit)
  } catch (error: any) {
    console.error('Error scraping airdrops from CoinMarketCap:', error.message)
    return []
  }
}

