'use client'

import Image from 'next/image'
import Link from 'next/link'
import { DeFiProtocol } from '@/lib/types'

interface DeFiViewProps {
  protocols: DeFiProtocol[]
}

export default function DeFiView({ protocols }: DeFiViewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">DeFi Protocols</h1>
        
        {protocols.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No DeFi protocols found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.map((protocol) => (
              <Link 
                key={protocol.id} 
                href={`/tokens/${protocol.symbol.toLowerCase()}`}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer block"
              >
                <div className="flex items-center space-x-3 mb-4">
                  {protocol.logo && (
                    <Image src={protocol.logo} alt={protocol.name} width={48} height={48} className="rounded-full" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{protocol.name}</h3>
                    <p className="text-sm text-gray-400">{protocol.symbol}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TVL</span>
                    <span className="text-white font-semibold">{formatNumber(protocol.tvl)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={`font-semibold ${getChangeColor(protocol.tvlChange24h)}`}>
                      {protocol.tvlChange24h >= 0 ? '↑' : '↓'} {Math.abs(protocol.tvlChange24h).toFixed(2)}%
                    </span>
                  </div>
                  {protocol.chains.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chains</span>
                      <span className="text-white text-sm">{protocol.chains.join(', ')}</span>
                    </div>
                  )}
                  {protocol.website && (
                    <a
                      href={protocol.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-4 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

