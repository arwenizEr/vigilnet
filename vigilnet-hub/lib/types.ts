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

export interface TokenDetail extends Token {
  circulatingSupply?: number
  totalSupply?: number
  maxSupply?: number
  website?: string
  whitepaper?: string
  description?: string
  socialLinks?: {
    twitter?: string
    reddit?: string
    github?: string
    telegram?: string
    discord?: string
    facebook?: string
    linkedin?: string
  }
  dateAdded?: string
  dateLaunched?: string
  tags?: string[]
  platform?: {
    name: string
    symbol: string
    tokenAddress?: string
  }
  fullyDilutedMarketCap?: number
  marketCapDominance?: number
  priceChange30d?: number
  priceChange60d?: number
  priceChange90d?: number
  volumeChange24h?: number
  marketCapChange24h?: number
  selfReportedCirculatingSupply?: number
  selfReportedMarketCap?: number
}

export interface PriceHistory {
  timestamp: number
  price: number
  volume?: number
}

export interface MarketStats {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  ethDominance: number
  activeCryptocurrencies: number
  marketCapChange24h: number
}

export interface DeFiProtocol {
  id: string
  name: string
  symbol: string
  tvl: number
  tvlChange24h: number
  chains: string[]
  category: string
  website?: string
  logo?: string
}

export interface Exchange {
  id: string
  name: string
  country?: string
  yearEstablished?: number
  trustScore?: number
  trustScoreRank?: number
  tradingVolume24h?: number
  website?: string
  logo?: string
}

