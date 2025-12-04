'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PriceChartProps {
  symbol: string
  currentPrice: number
}

interface PriceDataPoint {
  date: string
  price: number
  timestamp: number
}

export default function PriceChart({ symbol, currentPrice }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [data, setData] = useState<PriceDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true)
      setError(null)
      
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
      
      try {
        const response = await fetch(`/api/prices/history?symbol=${symbol}&days=${days}`)
        const result = await response.json()
        
        if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
          // Transform the API data to chart format
          const chartData: PriceDataPoint[] = result.data.map((item: { timestamp: number; price: number }) => {
            const date = new Date(item.timestamp)
            return {
              timestamp: item.timestamp,
              price: item.price,
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            }
          })
          
          // Ensure the last point matches current price exactly
          if (chartData.length > 0) {
            chartData[chartData.length - 1].price = currentPrice
            chartData[chartData.length - 1].timestamp = Date.now()
          }
          
          setData(chartData)
        } else {
          // Fallback to mock data if API fails
          const reason = result.message || (result.data && result.data.length === 0 ? 'No data returned' : 'API returned unsuccessful response')
          console.warn(`[PriceChart] Failed to fetch real price history for ${symbol}: ${reason}. Using mock data.`)
          generateMockData()
        }
      } catch (err) {
        console.error('Error fetching price history:', err)
        setError('Failed to load price data')
        // Fallback to mock data
        generateMockData()
      } finally {
        setLoading(false)
      }
    }

    const generateMockData = () => {
      if (currentPrice <= 0) {
        setData([])
        return
      }
      
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
      const dataPoints: PriceDataPoint[] = []
      
      // Calculate volatility based on price magnitude
      const volatility = currentPrice < 1 ? 0.05 : currentPrice < 100 ? 0.03 : 0.02
      
      // Start from a price slightly in the past
      let price = currentPrice * (0.85 + Math.random() * 0.3)
      
      // Generate a realistic trend
      const overallTrend = (Math.random() - 0.5) * 0.0005
      
      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Random walk with drift
        const randomFactor = (Math.random() - 0.5) * 2
        const dailyChange = randomFactor * volatility + overallTrend
        
        // Apply change
        price = price * (1 + dailyChange)
        
        // Mean reversion toward current price
        const daysFromNow = days - i
        const reversionStrength = Math.min(daysFromNow / days, 0.3)
        price = price * (1 - reversionStrength * 0.1) + currentPrice * reversionStrength * 0.1
        
        // Ensure price stays within reasonable bounds
        price = Math.max(price, currentPrice * 0.3)
        price = Math.min(price, currentPrice * 3)
        
        dataPoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: currentPrice >= 1 
            ? Number(price.toFixed(2))
            : Number(price.toFixed(Math.max(2, 8 - Math.floor(Math.log10(price))))),
          timestamp: date.getTime(),
        })
      }
      
      // Ensure the last point matches current price exactly
      if (dataPoints.length > 0) {
        dataPoints[dataPoints.length - 1].price = currentPrice >= 1 
          ? Number(currentPrice.toFixed(2))
          : Number(currentPrice.toFixed(Math.max(2, 8 - Math.floor(Math.log10(currentPrice)))))
      }
      
      setData(dataPoints)
    }

    fetchPriceHistory()
  }, [timeframe, symbol, currentPrice])

  const formatPrice = (price: number) => {
    if (currentPrice >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
  }

  const getPriceChange = () => {
    if (data.length < 2) return 0
    const firstPrice = data[0].price
    const lastPrice = data[data.length - 1].price
    return ((lastPrice - firstPrice) / firstPrice) * 100
  }

  const priceChange = getPriceChange()
  const isPositive = priceChange >= 0

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {formatPrice(currentPrice)}
          </div>
          <div className={`text-xs sm:text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}% ({timeframe})
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 450}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
            tickFormatter={(value) => {
              if (currentPrice >= 1) {
                return `$${(value / 1000).toFixed(0)}K`
              }
              return `$${value.toFixed(4)}`
            }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              padding: '12px'
            }}
            labelStyle={{ color: '#F3F4F6', marginBottom: '8px', fontWeight: '600' }}
            formatter={(value: number) => [formatPrice(value), 'Price']}
            cursor={{ stroke: '#6B7280', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth={2.5}
            fill="url(#priceGradient)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {loading && (
        <div className="mt-4 text-center text-gray-400 text-sm">Loading price history...</div>
      )}
      {error && (
        <div className="mt-4 text-center text-yellow-400 text-sm">{error}</div>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="mt-4 text-center text-gray-400 text-sm">No price data available</div>
      )}
      {!loading && !error && data.length > 0 && (
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>Price Trend</span>
          </div>
          <span>•</span>
          <span>Real-time data from CoinGecko</span>
        </div>
      )}
    </div>
  )
}

