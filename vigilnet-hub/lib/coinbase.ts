import axios from 'axios'
import { Token, PriceUpdate, Airdrop } from './types'

const COINBASE_API_KEY = process.env.COINBASE_API_KEY || '5296e9f5679948df9e97e25172a2be36'
// Coinbase Advanced Trade API
const COINBASE_API = 'https://api.coinbase.com/api/v3/brokerage'

export interface CoinbaseProduct {
  product_id: string
  price: string
  price_percentage_change_24h: string
  volume_24h: string
  volume_percentage_change_24h: string
  base_increment: string
  quote_increment: string
  quote_min_size: string
  quote_max_size: string
  base_min_size: string
  base_max_size: string
  base_name: string
  quote_name: string
  watched: boolean
  is_disabled: boolean
  new: boolean
  status: string
  cancel_only: boolean
  limit_only: boolean
  post_only: boolean
  trading_disabled: boolean
  auction_mode: boolean
  product_type: string
  quote_currency_id: string
  base_currency_id: string
  fcm_trading_session_details?: any
  mid_market_price?: string
  alias?: string
  alias_to?: string[]
  base_display_symbol: string
  quote_display_symbol: string
  view_only: boolean
  price_increment: string
  display_name: string
  product_venue: string
  approval_required: boolean
  limit_required: boolean
}

export interface CoinbaseTicker {
  trades: Array<{
    trade_id: string
    product_id: string
    price: string
    size: string
    time: string
    side: string
    bid: string
    ask: string
  }>
  best_bid: string
  best_ask: string
}

export async function fetchCoinbaseTopTokens(limit: number = 200): Promise<Token[]> {
  if (!COINBASE_API_KEY || COINBASE_API_KEY.length < 20) {
    console.warn('Coinbase API key not configured')
    return []
  }

  try {
    // Use ONLY Coinbase Market API (Advanced Trade API)
    const productsResponse = await axios.get(`${COINBASE_API}/products`, {
      headers: {
        'X-API-Key': COINBASE_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 15000,
    })

    // Coinbase Market API returns object with products array
    const products: CoinbaseProduct[] = productsResponse.data?.products || []
    
    // Filter for USD pairs and active products
    let usdProducts = products
      .filter((p: CoinbaseProduct) => 
        p.quote_currency_id === 'USD' && 
        p.status === 'online' && 
        !p.is_disabled &&
        !p.trading_disabled
      )

    // Sort by volume if available, otherwise by price
    usdProducts.sort((a, b) => {
      const volA = parseFloat(a.volume_24h || '0')
      const volB = parseFloat(b.volume_24h || '0')
      return volB - volA
    })

    // Take only the requested limit
    usdProducts = usdProducts.slice(0, limit)

    const tokens: Token[] = []
    
    usdProducts.forEach((product: CoinbaseProduct, index: number) => {
      const price = parseFloat(product.price || '0')
      const priceChange24h = parseFloat(product.price_percentage_change_24h || '0')

      tokens.push({
        id: `coinbase-${product.product_id}`,
        name: product.base_name || product.base_display_symbol,
        symbol: product.base_display_symbol || product.base_currency_id,
        price,
        priceChange24h,
        marketCap: undefined, // Coinbase Market API doesn't provide market cap directly
        image: undefined,
        rank: index + 1,
        coinId: product.product_id.toLowerCase(),
      })
    })

    return tokens
  } catch (error: any) {
    console.error('Error fetching from Coinbase Market API:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    return []
  }
}

export async function fetchCoinbasePrices(productIds: string[]): Promise<PriceUpdate[]> {
  if (!COINBASE_API_KEY || COINBASE_API_KEY.length < 20) {
    return []
  }

  try {
    // Use ONLY Coinbase Market API (Advanced Trade API)
    const productsResponse = await axios.get(`${COINBASE_API}/products`, {
      headers: {
        'X-API-Key': COINBASE_API_KEY,
        'Accept': 'application/json',
      },
      timeout: 10000,
    })

    const allProducts: CoinbaseProduct[] = productsResponse.data.products || []
    const prices: PriceUpdate[] = []

    productIds.forEach((productId) => {
      const product = allProducts.find(
        (p: CoinbaseProduct) => p.product_id.toLowerCase() === productId.toLowerCase()
      )
      
      if (product && product.price) {
        const price = parseFloat(product.price)
        const priceChange24h = parseFloat(product.price_percentage_change_24h || '0')
        
        prices.push({
          coinId: product.product_id,
          symbol: product.base_display_symbol || product.base_currency_id,
          price,
          priceChange24h,
          timestamp: Date.now(),
        })
      }
    })

    return prices
  } catch (error: any) {
    console.error('Error fetching prices from Coinbase:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
    }
    return []
  }
}

// Coinbase doesn't have an airdrops API, so return empty array
export async function fetchCoinbaseAirdrops(limit: number = 50): Promise<Airdrop[]> {
  // Coinbase Market API does not provide airdrop information
  // Return empty array as Coinbase doesn't have this endpoint
  return []
}

