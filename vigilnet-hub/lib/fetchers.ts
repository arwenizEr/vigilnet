import axios from 'axios'
import { Token, Testnet, PriceUpdate } from './types'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function fetchTrendingTokens(): Promise<Token[]> {
  try {
    const response = await axios.get(`${COINGECKO_API}/search/trending`, {
      timeout: 10000,
    })

    const trending = response.data.coins || []
    
    // Get detailed info for each token
    const coinIds = trending.map((coin: any) => coin.item.id).join(',')
    
    const detailsResponse = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
      { timeout: 10000 }
    )

    const details = detailsResponse.data

    return trending.map((coin: any, index: number) => {
      const coinId = coin.item.id
      const priceData = details[coinId] || {}
      
      return {
        id: `token-${coinId}`,
        name: coin.item.name,
        symbol: coin.item.symbol.toUpperCase(),
        price: priceData.usd || 0,
        priceChange24h: priceData.usd_24h_change || 0,
        marketCap: priceData.usd_market_cap,
        image: coin.item.large || coin.item.small,
        rank: index + 1,
        coinId,
      }
    })
  } catch (error) {
    console.error('Error fetching trending tokens:', error)
    return []
  }
}

export async function fetchTokenPrices(coinIds: string[]): Promise<PriceUpdate[]> {
  try {
    const ids = coinIds.join(',')
    const response = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { timeout: 10000 }
    )

    return Object.entries(response.data).map(([coinId, data]: [string, any]) => ({
      coinId,
      symbol: coinId.toUpperCase(),
      price: data.usd || 0,
      priceChange24h: data.usd_24h_change || 0,
      timestamp: Date.now(),
    }))
  } catch (error) {
    console.error('Error fetching token prices:', error)
    return []
  }
}

export async function fetchTestnets(): Promise<Testnet[]> {
  try {
    // Try fetching from ChainList's GitHub raw data
    // We'll fetch a few known testnet chain files
    const testnetChainIds = [
      11155111, // Sepolia
      80001,    // Mumbai (Polygon)
      97,       // BSC Testnet
      43113,    // Avalanche Fuji
      4002,     // Fantom Testnet
      421613,   // Arbitrum Goerli
      84531,    // Base Goerli
      280,      // zkSync Era Testnet
    ]

    const chains: any[] = []
    
    // Try to fetch a few chains from GitHub
    for (const chainId of testnetChainIds.slice(0, 3)) {
      try {
        const response = await axios.get(
          `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${chainId}.json`,
          { timeout: 5000 }
        )
        if (response.data) {
          chains.push(response.data)
        }
      } catch (err) {
        // Continue with other chains
      }
    }

    // If we got some chains, use them, otherwise use fallback
    if (chains.length > 0) {
      return chains
        .filter((chain: any) => chain.testnet === true)
        .map((chain: any) => ({
          id: `testnet-${chain.chainId}`,
          name: chain.name,
          chainId: chain.chainId,
          rpc: chain.rpc || [],
          explorers: chain.explorers?.map((exp: any) => exp.url) || [],
          testnet: true,
          nativeCurrency: chain.nativeCurrency,
        }))
    }

    // Fallback to known testnets
    return getKnownTestnets()
  } catch (error) {
    console.error('Error fetching testnets:', error)
    // Return known testnets as fallback
    return getKnownTestnets()
  }
}

function getKnownTestnets(): Testnet[] {
  // Curated list of popular testnets with their details
  return [
    {
      id: 'testnet-11155111',
      name: 'Sepolia',
      chainId: 11155111,
      rpc: ['https://rpc.sepolia.org', 'https://sepolia.infura.io/v3/YOUR-PROJECT-ID'],
      explorers: ['https://sepolia.etherscan.io'],
      testnet: true,
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    },
    {
      id: 'testnet-80001',
      name: 'Mumbai',
      chainId: 80001,
      rpc: ['https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.maticvigil.com'],
      explorers: ['https://mumbai.polygonscan.com'],
      testnet: true,
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    },
    {
      id: 'testnet-97',
      name: 'BSC Testnet',
      chainId: 97,
      rpc: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
      explorers: ['https://testnet.bscscan.com'],
      testnet: true,
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    },
    {
      id: 'testnet-43113',
      name: 'Avalanche Fuji',
      chainId: 43113,
      rpc: ['https://api.avax-test.network/ext/bc/C/rpc'],
      explorers: ['https://testnet.snowtrace.io'],
      testnet: true,
      nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    },
    {
      id: 'testnet-421613',
      name: 'Arbitrum Goerli',
      chainId: 421613,
      rpc: ['https://goerli-rollup.arbitrum.io/rpc'],
      explorers: ['https://goerli.arbiscan.io'],
      testnet: true,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    },
    {
      id: 'testnet-84531',
      name: 'Base Goerli',
      chainId: 84531,
      rpc: ['https://goerli.base.org'],
      explorers: ['https://goerli.basescan.org'],
      testnet: true,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    },
    {
      id: 'testnet-4002',
      name: 'Fantom Testnet',
      chainId: 4002,
      rpc: ['https://rpc.testnet.fantom.network'],
      explorers: ['https://testnet.ftmscan.com'],
      testnet: true,
      nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    },
    {
      id: 'testnet-280',
      name: 'zkSync Era Testnet',
      chainId: 280,
      rpc: ['https://testnet.era.zksync.dev'],
      explorers: ['https://goerli.explorer.zksync.io'],
      testnet: true,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    },
  ]
}

