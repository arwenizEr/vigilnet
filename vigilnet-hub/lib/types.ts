export interface NewsItem {
  id: string
  title: string
  link: string
  pubDate: string
  content?: string
  source: string
  image?: string
}

export interface Token {
  id: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  priceChange1h?: number
  priceChange7d?: number
  volume24h?: number
  marketCap?: number
  image?: string
  rank?: number
  coinId: string
}

export interface Airdrop {
  id: string
  title: string
  link: string
  reward?: string
  category?: string
  status?: string
  description?: string
}

export interface Testnet {
  id: string
  name: string
  chainId: number
  rpc: string[]
  explorers?: string[]
  testnet: boolean
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface PriceUpdate {
  coinId: string
  symbol: string
  price: number
  priceChange24h: number
  timestamp: number
}

