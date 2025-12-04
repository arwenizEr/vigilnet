'use client'

import Image from 'next/image'
import { Exchange } from '@/lib/types'

interface ExchangesViewProps {
  exchanges: Exchange[]
}

export default function ExchangesView({ exchanges }: ExchangesViewProps) {
  const formatNumber = (num: number | undefined) => {
    if (!num) return 'N/A'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Cryptocurrency Exchanges</h1>
        
        {exchanges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No exchanges found</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Exchange</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Country</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Trust Score</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">24h Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {exchanges.map((exchange, index) => (
                    <tr key={exchange.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {exchange.logo && (
                            <Image src={exchange.logo} alt={exchange.name} width={32} height={32} className="rounded" />
                          )}
                          <div>
                            <div className="font-semibold text-white">{exchange.name}</div>
                            {exchange.website && (
                              <a
                                href={exchange.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Visit →
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{exchange.country || 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        {exchange.trustScore ? (
                          <span className="text-white font-semibold">{exchange.trustScore}/10</span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-white">
                        {formatNumber(exchange.tradingVolume24h)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{exchange.yearEstablished || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

