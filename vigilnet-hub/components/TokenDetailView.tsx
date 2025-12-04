'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TokenDetail, NewsItem } from '@/lib/types'
import NewsCard from './NewsCard'
import PriceChart from './PriceChart'
import WatchlistButton from './WatchlistButton'

interface TokenDetailViewProps {
  token: TokenDetail
  relatedNews: NewsItem[]
}

export default function TokenDetailView({ token, relatedNews }: TokenDetailViewProps) {
  const formatNumber = (num: number | undefined) => {
    if (!num) return 'N/A'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatSupply = (num: number | undefined) => {
    if (!num) return 'N/A'
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toLocaleString('en-US')
  }

  const getPriceChangeColor = (change: number | undefined) => {
    if (!change) return 'text-gray-400'
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPriceChangeIcon = (change: number | undefined) => {
    if (!change) return ''
    return change >= 0 ? '↑' : '↓'
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {token.image && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={token.image}
                    alt={token.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-white">{token.name}</h1>
                <p className="text-xl text-gray-400">{token.symbol}</p>
              </div>
            </div>
            <WatchlistButton token={token} />
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            {token.rank && <span>Rank #{token.rank}</span>}
            {token.website && (
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Website
              </a>
            )}
            {token.socialLinks?.twitter && (
              <a
                href={token.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Twitter
              </a>
            )}
            {token.socialLinks?.reddit && (
              <a
                href={token.socialLinks.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Reddit
              </a>
            )}
            {token.socialLinks?.github && (
              <a
                href={token.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-gray-400 text-sm mb-1">Price</div>
              <div className="text-2xl font-bold text-white">
                ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">24h Change</div>
              <div className={`text-2xl font-bold ${getPriceChangeColor(token.priceChange24h)}`}>
                {getPriceChangeIcon(token.priceChange24h)} {Math.abs(token.priceChange24h || 0).toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Market Cap</div>
              <div className="text-2xl font-bold text-white">
                {formatNumber(token.marketCap)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">24h Volume</div>
              <div className="text-2xl font-bold text-white">
                {formatNumber(token.volume24h)}
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Price Chart</h2>
          <PriceChart symbol={token.symbol} />
        </div>

        {/* Extended Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">1h Change</div>
            <div className={`text-xl font-bold ${getPriceChangeColor(token.priceChange1h)}`}>
              {getPriceChangeIcon(token.priceChange1h)} {Math.abs(token.priceChange1h || 0).toFixed(2)}%
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">7d Change</div>
            <div className={`text-xl font-bold ${getPriceChangeColor(token.priceChange7d)}`}>
              {getPriceChangeIcon(token.priceChange7d)} {Math.abs(token.priceChange7d || 0).toFixed(2)}%
            </div>
          </div>
          {token.priceChange30d !== undefined && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">30d Change</div>
              <div className={`text-xl font-bold ${getPriceChangeColor(token.priceChange30d)}`}>
                {getPriceChangeIcon(token.priceChange30d)} {Math.abs(token.priceChange30d).toFixed(2)}%
              </div>
            </div>
          )}
          {token.priceChange90d !== undefined && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">90d Change</div>
              <div className={`text-xl font-bold ${getPriceChangeColor(token.priceChange90d)}`}>
                {getPriceChangeIcon(token.priceChange90d)} {Math.abs(token.priceChange90d).toFixed(2)}%
              </div>
            </div>
          )}
        </div>

        {/* Supply & Market Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Circulating Supply</div>
            <div className="text-xl font-bold text-white">
              {formatSupply(token.circulatingSupply)} {token.symbol}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Supply</div>
            <div className="text-xl font-bold text-white">
              {formatSupply(token.totalSupply)} {token.symbol}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Max Supply</div>
            <div className="text-xl font-bold text-white">
              {token.maxSupply ? formatSupply(token.maxSupply) : '∞'} {token.symbol}
            </div>
          </div>
          {token.fullyDilutedMarketCap && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Fully Diluted Market Cap</div>
              <div className="text-xl font-bold text-white">
                {formatNumber(token.fullyDilutedMarketCap)}
              </div>
            </div>
          )}
        </div>

        {/* Additional Metrics */}
        {(token.marketCapDominance || token.volumeChange24h || token.marketCapChange24h) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {token.marketCapDominance && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Market Cap Dominance</div>
                <div className="text-xl font-bold text-white">
                  {token.marketCapDominance.toFixed(2)}%
                </div>
              </div>
            )}
            {token.volumeChange24h !== undefined && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Volume Change (24h)</div>
                <div className={`text-xl font-bold ${getPriceChangeColor(token.volumeChange24h)}`}>
                  {getPriceChangeIcon(token.volumeChange24h)} {Math.abs(token.volumeChange24h).toFixed(2)}%
                </div>
              </div>
            )}
            {token.marketCapChange24h !== undefined && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Market Cap Change (24h)</div>
                <div className={`text-xl font-bold ${getPriceChangeColor(token.marketCapChange24h)}`}>
                  {getPriceChangeIcon(token.marketCapChange24h)} {Math.abs(token.marketCapChange24h).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Platform Info */}
        {token.platform && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Platform Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-gray-400 text-sm mb-1">Platform</div>
                <div className="text-white font-semibold">{token.platform.name}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Symbol</div>
                <div className="text-white font-semibold">{token.platform.symbol}</div>
              </div>
              {token.platform.tokenAddress && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Token Address</div>
                  <div className="text-white font-mono text-sm break-all">{token.platform.tokenAddress}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {token.tags && token.tags.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {token.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Links */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Links & Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {token.website && (
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Website</span>
              </a>
            )}
            {token.whitepaper && (
              <a
                href={token.whitepaper}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Whitepaper</span>
              </a>
            )}
            {token.socialLinks?.twitter && (
              <a
                href={token.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                <span>Twitter</span>
              </a>
            )}
            {token.socialLinks?.telegram && (
              <a
                href={token.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span>Telegram</span>
              </a>
            )}
            {token.socialLinks?.discord && (
              <a
                href={token.socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord</span>
              </a>
            )}
            {token.socialLinks?.github && (
              <a
                href={token.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}
            {token.socialLinks?.reddit && (
              <a
                href={token.socialLinks.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534a1.748 1.748 0 0 1-1.01-1.614c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.845.57a1.251 1.251 0 0 1 1.249-.836zm-4.48 8.184c.717 0 1.3-.583 1.3-1.3s-.583-1.3-1.3-1.3-1.3.583-1.3 1.3.583 1.3 1.3 1.3zm-4.78 0c.717 0 1.3-.583 1.3-1.3s-.583-1.3-1.3-1.3-1.3.583-1.3 1.3.583 1.3 1.3 1.3z" />
                </svg>
                <span>Reddit</span>
              </a>
            )}
          </div>
        </div>

        {/* Date Information */}
        {(token.dateAdded || token.dateLaunched) && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {token.dateAdded && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Date Added to CoinMarketCap</div>
                  <div className="text-white font-semibold">
                    {new Date(token.dateAdded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}
              {token.dateLaunched && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Launch Date</div>
                  <div className="text-white font-semibold">
                    {new Date(token.dateLaunched).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {token.description && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{token.description}</p>
          </div>
        )}

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

