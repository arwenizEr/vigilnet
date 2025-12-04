'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PriceChartProps {
  symbol: string
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [data, setData] = useState<Array<{ date: string; price: number }>>([])

  useEffect(() => {
    // Generate mock data for demonstration
    // In production, you would fetch real historical data
    const generateMockData = () => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
      const mockData = []
      const basePrice = 1000
      
      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const variation = (Math.random() - 0.5) * 0.1
        const price = basePrice * (1 + variation * (days - i) / days)
        mockData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(price.toFixed(2)),
        })
      }
      return mockData
    }

    setData(generateMockData())
  }, [timeframe, symbol])

  return (
    <div>
      <div className="flex justify-end mb-4 space-x-2">
        {(['7d', '30d', '90d', '1y'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-gray-500 text-sm mt-4 text-center">
        Note: Chart shows mock data. Real historical data requires a paid API subscription.
      </p>
    </div>
  )
}

