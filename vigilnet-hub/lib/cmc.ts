import axios from 'axios'
import * as cheerio from 'cheerio'
import { Token, Airdrop, TokenDetail, MarketStats, DeFiProtocol, Exchange, PriceHistory } from './types'

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

export async function fetchCMCTokenDetail(symbol: string): Promise<TokenDetail | null> {
  if (!CMC_API_KEY) {
    return null
  }

  try {
    // Fetch both quotes and info endpoints for comprehensive data
    const [quotesResponse, infoResponse] = await Promise.all([
      axios.get(`${CMC_API}/cryptocurrency/quotes/latest`, {
        params: {
          symbol: symbol.toUpperCase(),
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
        timeout: 10000,
      }),
      axios.get(`${CMC_API}/cryptocurrency/info`, {
        params: {
          symbol: symbol.toUpperCase(),
        },
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
        timeout: 10000,
      }).catch(() => null), // Info endpoint might not be available in all tiers
    ])

    if (!quotesResponse.data || !quotesResponse.data.data) {
      return null
    }

    const tokenData = Object.values(quotesResponse.data.data)[0] as any
    if (!tokenData) return null

    const quote = tokenData.quote?.USD || {}
    const infoData = infoResponse?.data?.data 
      ? Object.values(infoResponse.data.data)[0] as any 
      : null

    // Extract tags
    const tags = tokenData.tags 
      ? tokenData.tags.map((tag: any) => typeof tag === 'string' ? tag : tag.name || tag.slug).filter(Boolean)
      : []

    return {
      id: `cmc-${tokenData.id}`,
      name: tokenData.name,
      symbol: tokenData.symbol,
      price: quote.price || 0,
      priceChange24h: quote.percent_change_24h || 0,
      priceChange1h: quote.percent_change_1h || 0,
      priceChange7d: quote.percent_change_7d || 0,
      priceChange30d: quote.percent_change_30d,
      priceChange60d: quote.percent_change_60d,
      priceChange90d: quote.percent_change_90d,
      volume24h: quote.volume_24h || 0,
      volumeChange24h: quote.volume_change_24h,
      marketCap: quote.market_cap || 0,
      marketCapChange24h: quote.market_cap_change_24h,
      fullyDilutedMarketCap: quote.fully_diluted_market_cap,
      marketCapDominance: quote.market_cap_dominance,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${tokenData.id}.png`,
      rank: tokenData.cmc_rank,
      coinId: tokenData.slug,
      circulatingSupply: tokenData.circulating_supply,
      totalSupply: tokenData.total_supply,
      maxSupply: tokenData.max_supply,
      selfReportedCirculatingSupply: tokenData.self_reported_circulating_supply,
      selfReportedMarketCap: tokenData.self_reported_market_cap,
      description: infoData?.description || tokenData.description,
      dateAdded: infoData?.date_added || tokenData.date_added,
      dateLaunched: infoData?.date_launched,
      tags,
      platform: tokenData.platform ? {
        name: tokenData.platform.name,
        symbol: tokenData.platform.symbol,
        tokenAddress: tokenData.platform.token_address,
      } : undefined,
      website: tokenData.urls?.website?.[0] || infoData?.urls?.website?.[0],
      whitepaper: tokenData.urls?.technical_doc?.[0] || infoData?.urls?.technical_doc?.[0],
      socialLinks: {
        twitter: tokenData.urls?.twitter?.[0] || infoData?.urls?.twitter?.[0],
        reddit: tokenData.urls?.reddit?.[0] || infoData?.urls?.reddit?.[0],
        github: tokenData.urls?.source_code?.[0] || infoData?.urls?.source_code?.[0],
        telegram: tokenData.urls?.telegram?.[0] || infoData?.urls?.telegram?.[0],
        discord: infoData?.urls?.discord?.[0],
        facebook: infoData?.urls?.facebook?.[0],
        linkedin: infoData?.urls?.linkedin?.[0],
      },
    }
  } catch (error: any) {
    console.error('Error fetching token detail from CoinMarketCap:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    return null
  }
}

export async function fetchCMCMarketStats(): Promise<MarketStats | null> {
  if (!CMC_API_KEY) {
    return null
  }

  try {
    const response = await axios.get(`${CMC_API}/global-metrics/quotes/latest`, {
      params: {
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 10000,
    })

    if (response.data && response.data.data) {
      const data = response.data.data
      const quote = data.quote?.USD || {}
      
      return {
        totalMarketCap: quote.total_market_cap || 0,
        totalVolume24h: quote.total_volume_24h || 0,
        btcDominance: data.btc_dominance || 0,
        ethDominance: data.eth_dominance || 0,
        activeCryptocurrencies: data.active_cryptocurrencies || 0,
        marketCapChange24h: quote.total_market_cap_yesterday_percentage_change || 0,
      }
    }
    return null
  } catch (error: any) {
    console.error('Error fetching market stats from CoinMarketCap:', error.message)
    return null
  }
}

export async function fetchCMCPriceHistory(symbol: string, days: number = 30): Promise<PriceHistory[]> {
  // Note: CoinMarketCap API doesn't provide historical price data in the free tier
  // Using CoinGecko API for historical data (free tier available)
  try {
    console.log(`[PriceHistory] Fetching history for ${symbol}, days: ${days}`)
    
    // First, get the CoinGecko ID from the symbol
    const searchResponse = await axios.get('https://api.coingecko.com/api/v3/search', {
      params: {
        query: symbol.toLowerCase(),
      },
      timeout: 10000,
    })

    if (!searchResponse.data?.coins || searchResponse.data.coins.length === 0) {
      console.warn(`[PriceHistory] No CoinGecko ID found for symbol: ${symbol}`)
      return []
    }

    const coinId = searchResponse.data.coins[0].id
    console.log(`[PriceHistory] Found CoinGecko ID: ${coinId} for symbol: ${symbol}`)
    
    const daysParam = days === 365 ? 365 : days === 90 ? 90 : days === 7 ? 7 : 30

    // Fetch historical market data
    const historyResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: daysParam,
        interval: daysParam <= 7 ? 'hourly' : 'daily',
      },
      timeout: 15000,
    })

    if (historyResponse.data?.prices && Array.isArray(historyResponse.data.prices)) {
      const priceData = historyResponse.data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
        date: new Date(timestamp).toISOString(),
      }))
      console.log(`[PriceHistory] Successfully fetched ${priceData.length} data points for ${symbol}`)
      return priceData
    }

    console.warn(`[PriceHistory] No price data in response for ${symbol}`)
    return []
  } catch (error: any) {
    console.error(`[PriceHistory] Error fetching price history for ${symbol} from CoinGecko:`, error.message)
    if (error.response) {
      console.error(`[PriceHistory] Response status: ${error.response.status}`)
      console.error(`[PriceHistory] Response data:`, error.response.data)
    }
    return []
  }
}

export async function fetchCMCTopGainersLosers(): Promise<{ gainers: Token[]; losers: Token[] }> {
  if (!CMC_API_KEY) {
    return { gainers: [], losers: [] }
  }

  try {
    // Fetch tokens sorted by 24h change descending (for gainers)
    const gainersResponse = await axios.get(`${CMC_API}/cryptocurrency/listings/latest`, {
      params: {
        start: 1,
        limit: 200,
        convert: 'USD',
        sort: 'percent_change_24h',
        sort_dir: 'desc',
      },
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 15000,
    })

    // Fetch tokens sorted by 24h change ascending (for losers)
    const losersResponse = await axios.get(`${CMC_API}/cryptocurrency/listings/latest`, {
      params: {
        start: 1,
        limit: 200,
        convert: 'USD',
        sort: 'percent_change_24h',
        sort_dir: 'asc',
      },
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 15000,
    })

    const mapToken = (token: any) => {
      const quote = token.quote?.USD || {}
      // Ensure market_cap is properly extracted
      const marketCap = quote.market_cap !== undefined && quote.market_cap !== null && quote.market_cap > 0 
        ? quote.market_cap 
        : undefined
      
      return {
        id: `cmc-${token.id}`,
        name: token.name,
        symbol: token.symbol,
        price: quote.price || 0,
        priceChange24h: quote.percent_change_24h || 0,
        priceChange1h: quote.percent_change_1h || 0,
        priceChange7d: quote.percent_change_7d || 0,
        volume24h: quote.volume_24h || 0,
        marketCap: marketCap,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.id}.png`,
        rank: token.cmc_rank,
        coinId: token.slug,
      }
    }

    let gainers: Token[] = []
    let losers: Token[] = []

    if (gainersResponse.data && gainersResponse.data.data) {
      gainers = gainersResponse.data.data
        .map(mapToken)
        .filter((t: Token) => t.priceChange24h > 0)
        .slice(0, 10)
      
      // Debug: Log first token to check marketCap
      if (gainers.length > 0) {
        console.log('Sample gainer token:', {
          name: gainers[0].name,
          symbol: gainers[0].symbol,
          marketCap: gainers[0].marketCap,
          rawMarketCap: gainersResponse.data.data[0]?.quote?.USD?.market_cap
        })
      }
    }

    if (losersResponse.data && losersResponse.data.data) {
      losers = losersResponse.data.data
        .map(mapToken)
        .filter((t: Token) => t.priceChange24h < 0)
        .slice(0, 10)
      
      // Debug: Log first token to check marketCap
      if (losers.length > 0) {
        console.log('Sample loser token:', {
          name: losers[0].name,
          symbol: losers[0].symbol,
          marketCap: losers[0].marketCap,
          rawMarketCap: losersResponse.data.data[0]?.quote?.USD?.market_cap
        })
      }
    }

    return { gainers, losers }
  } catch (error: any) {
    console.error('Error fetching gainers/losers from CoinMarketCap:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    return { gainers: [], losers: [] }
  }
}

export async function fetchCMCExchanges(limit: number = 50): Promise<Exchange[]> {
  if (!CMC_API_KEY) {
    console.warn('CoinMarketCap API key not configured')
    return []
  }

  try {
    const response = await axios.get(`${CMC_API}/exchange/listings/latest`, {
      params: {
        start: 1,
        limit,
        sort: 'volume_24h',
        sort_dir: 'desc',
      },
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 15000,
    })

    if (response.data && response.data.data) {
      const exchangesData = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data)

      return exchangesData.map((exchange: any) => ({
        id: `cmc-exchange-${exchange.id}`,
        name: exchange.name,
        country: exchange.country,
        yearEstablished: exchange.year_established,
        trustScore: exchange.trust_score,
        trustScoreRank: exchange.trust_score_rank,
        tradingVolume24h: exchange.quote?.USD?.volume_24h || 0,
        website: exchange.urls?.website?.[0],
        logo: exchange.logo,
      }))
    }
    return []
  } catch (error: any) {
    console.error('Error fetching exchanges from CoinMarketCap:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    return []
  }
}

export async function fetchCMCDefiProtocols(limit: number = 50): Promise<DeFiProtocol[]> {
  if (!CMC_API_KEY) {
    console.warn('CoinMarketCap API key not configured')
    return []
  }

  try {
    // Try to get category list first to find DeFi category ID
    let categoryId = null
    try {
      const categoryResponse = await axios.get(`${CMC_API}/cryptocurrency/categories`, {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
        timeout: 10000,
      })

      if (categoryResponse.data && categoryResponse.data.data) {
        const defiCategory = categoryResponse.data.data.find(
          (cat: any) => cat.name?.toLowerCase().includes('defi') || cat.slug === 'defi'
        )
        if (defiCategory) {
          categoryId = defiCategory.id
        }
      }
    } catch (error: any) {
      console.log('Category endpoint not available, trying alternative approach')
    }

    // If we have a category ID, use it
    if (categoryId) {
      try {
        const response = await axios.get(`${CMC_API}/cryptocurrency/category`, {
          params: {
            id: categoryId,
            start: 1,
            limit,
            convert: 'USD',
          },
          headers: {
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
            'Accept': 'application/json',
          },
          timeout: 15000,
        })

        if (response.data && response.data.data && response.data.data.coins) {
          return response.data.data.coins.slice(0, limit).map((coin: any) => ({
            id: `defi-${coin.id}`,
            name: coin.name,
            symbol: coin.symbol,
            tvl: coin.quote?.USD?.market_cap || 0,
            tvlChange24h: coin.quote?.USD?.percent_change_24h || 0,
            chains: coin.platform?.name ? [coin.platform.name] : [],
            category: 'DeFi',
            website: coin.urls?.website?.[0],
            logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
          }))
        }
      } catch (error: any) {
        console.log('Category endpoint failed, trying listings with tag filter')
      }
    }

    // Fallback: Get all tokens and filter by tags
    const response = await axios.get(`${CMC_API}/cryptocurrency/listings/latest`, {
      params: {
        start: 1,
        limit: 500,
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
      // Filter tokens that have DeFi-related tags
      const defiTokens = response.data.data.filter((token: any) => {
        const tags = token.tags || []
        const tagStrings = tags.map((tag: any) => 
          typeof tag === 'string' ? tag.toLowerCase() : tag?.name?.toLowerCase() || ''
        )
        
        return tagStrings.some((tag: string) => 
          tag.includes('defi') || 
          tag.includes('decentralized-finance') ||
          tag.includes('yield-farming') ||
          tag.includes('lending') ||
          tag.includes('dex')
        )
      })

      return defiTokens.slice(0, limit).map((token: any) => ({
        id: `defi-${token.id}`,
        name: token.name,
        symbol: token.symbol,
        tvl: token.quote?.USD?.market_cap || 0,
        tvlChange24h: token.quote?.USD?.percent_change_24h || 0,
        chains: token.platform?.name ? [token.platform.name] : [],
        category: 'DeFi',
        website: token.urls?.website?.[0],
        logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.id}.png`,
      }))
    }
    return []
  } catch (error: any) {
    console.error('Error fetching DeFi protocols from CoinMarketCap:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    return []
  }
}

