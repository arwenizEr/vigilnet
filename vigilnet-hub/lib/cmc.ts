import axios from 'axios'
import { Token } from './types'

const CMC_API = 'https://pro-api.coinmarketcap.com/v1'
const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY || ''

// Fallback: Use CoinGecko if CMC API key is not available
const COINGECKO_API = 'https://api.coingecko.com/api/v3'

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

export async function fetchCMCTopTokens(limit: number = 100): Promise<Token[]> {
  // If API key is available, use CoinMarketCap
  if (CMC_API_KEY) {
    try {
      const response = await axios.get(`${CMC_API}/cryptocurrency/listings/latest`, {
        params: {
          start: 1,
          limit,
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          Accept: 'application/json',
        },
        timeout: 10000,
      })

      return response.data.data.map((token: CMCToken) => ({
        id: `cmc-${token.id}`,
        name: token.name,
        symbol: token.symbol,
        price: token.quote.USD.price,
        priceChange24h: token.quote.USD.percent_change_24h,
        marketCap: token.quote.USD.market_cap,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.id}.png`,
        rank: token.cmc_rank,
        coinId: token.slug,
      }))
    } catch (error) {
      console.error('Error fetching from CoinMarketCap API:', error)
      // Fallback to CoinGecko
      return fetchCoinGeckoTopTokens(limit)
    }
  }

  // Fallback to CoinGecko (free, no API key needed)
  return fetchCoinGeckoTopTokens(limit)
}

async function fetchCoinGeckoTopTokens(limit: number): Promise<Token[]> {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      { timeout: 10000 }
    )

    return response.data.map((token: any, index: number) => ({
      id: `gecko-${token.id}`,
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      price: token.current_price,
      priceChange24h: token.price_change_percentage_24h || 0,
      marketCap: token.market_cap,
      image: token.image,
      rank: index + 1,
      coinId: token.id,
    }))
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error)
    return []
  }
}

export async function fetchCMCPrices(symbols: string[]): Promise<Map<string, number>> {
  if (CMC_API_KEY) {
    try {
      const response = await axios.get(`${CMC_API}/cryptocurrency/quotes/latest`, {
        params: {
          symbol: symbols.join(','),
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          Accept: 'application/json',
        },
        timeout: 10000,
      })

      const priceMap = new Map<string, number>()
      Object.values(response.data.data).forEach((token: any) => {
        priceMap.set(token.symbol, token.quote.USD.price)
      })
      return priceMap
    } catch (error) {
      console.error('Error fetching prices from CoinMarketCap:', error)
    }
  }

  // Fallback to CoinGecko
  try {
    const ids = symbols.join(',').toLowerCase()
    const response = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd`,
      { timeout: 10000 }
    )

    const priceMap = new Map<string, number>()
    Object.entries(response.data).forEach(([id, data]: [string, any]) => {
      const symbol = symbols.find((s) => s.toLowerCase() === id)
      if (symbol) {
        priceMap.set(symbol, data.usd)
      }
    })
    return priceMap
  } catch (error) {
    console.error('Error fetching prices from CoinGecko:', error)
    return new Map()
  }
}

