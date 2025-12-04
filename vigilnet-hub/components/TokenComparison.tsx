'use client'

import { useState, useEffect } from 'react'
import { fetchCMCTokenDetail } from '@/lib/cmc'
import { TokenDetail } from '@/lib/types'
import Image from 'next/image'

interface TokenComparisonProps {
  initialSymbols: string[]
}

export default function TokenComparison({ initialSymbols }: TokenComparisonProps) {
  const [symbols, setSymbols] = useState<string[]>(initialSymbols.slice(0, 4))
  const [tokens, setTokens] = useState<(TokenDetail | null)[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (symbols.length > 0) {
      loadTokens()
    }
  }, [symbols])

  const loadTokens = async () => {
    setLoading(true)
    try {
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const res = await fetch(`/api/tokens/${symbol}`)
            if (!res.ok) return null
            const data = await res.json()
            return data.success ? data.data : null
          } catch {
            return null
          }
        })
      )
      setTokens(results)
    } catch (error) {
      console.error('Error loading tokens:', error)
      setTokens([])
    } finally {
      setLoading(false)
    }
  }

  const addToken = () => {
    if (inputValue.trim() && symbols.length < 4 && !symbols.includes(inputValue.toUpperCase())) {
      setSymbols([...symbols, inputValue.toUpperCase()])
      setInputValue('')
    }
  }

  const removeToken = (index: number) => {
    setSymbols(symbols.filter((_, i) => i !== index))
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return 'N/A'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const getPriceChangeColor = (change: number | undefined) => {
    if (!change) return 'text-gray-400'
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToken()}
            placeholder="Enter token symbol (e.g., BTC)"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={symbols.length >= 4}
          />
          <button
            onClick={addToken}
            disabled={symbols.length >= 4 || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {symbols.map((symbol, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-lg">
              <span className="text-white">{symbol}</span>
              <button
                onClick={() => removeToken(index)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {symbols.length >= 4 && (
          <p className="text-gray-500 text-sm mt-2">Maximum 4 tokens can be compared</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading tokens...</p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Add tokens to compare</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase">Metric</th>
                {tokens.map((token, index) => (
                  <th key={index} className="text-center py-4 px-6 text-xs font-semibold text-gray-400 uppercase">
                    {token ? (
                      <div className="flex items-center justify-center space-x-2">
                        {token.image && (
                          <Image src={token.image} alt={token.name} width={24} height={24} className="rounded-full" />
                        )}
                        <span>{token.symbol}</span>
                      </div>
                    ) : (
                      symbols[index]
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-6 text-gray-300 font-medium">Name</td>
                {tokens.map((token, index) => (
                  <td key={index} className="py-4 px-6 text-center text-white">
                    {token?.name || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-6 text-gray-300 font-medium">Price</td>
                {tokens.map((token, index) => (
                  <td key={index} className="py-4 px-6 text-center text-white">
                    {token?.price ? `$${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}` : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-6 text-gray-300 font-medium">24h Change</td>
                {tokens.map((token, index) => (
                  <td key={index} className={`py-4 px-6 text-center font-semibold ${getPriceChangeColor(token?.priceChange24h)}`}>
                    {token?.priceChange24h !== undefined
                      ? `${token.priceChange24h >= 0 ? '↑' : '↓'} ${Math.abs(token.priceChange24h).toFixed(2)}%`
                      : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-6 text-gray-300 font-medium">Market Cap</td>
                {tokens.map((token, index) => (
                  <td key={index} className="py-4 px-6 text-center text-white">
                    {formatNumber(token?.marketCap)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-6 text-gray-300 font-medium">24h Volume</td>
                {tokens.map((token, index) => (
                  <td key={index} className="py-4 px-6 text-center text-white">
                    {formatNumber(token?.volume24h)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-6 text-gray-300 font-medium">Rank</td>
                {tokens.map((token, index) => (
                  <td key={index} className="py-4 px-6 text-center text-white">
                    {token?.rank ? `#${token.rank}` : 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

