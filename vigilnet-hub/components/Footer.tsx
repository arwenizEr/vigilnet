export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">VigilNet Hub</h3>
            <p className="text-gray-400 text-sm">
              Real-time crypto and AI content aggregation platform. 
              Stay updated with the latest news, tokens, and prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/news" className="text-gray-400 hover:text-white transition-colors">
                  Crypto News
                </a>
              </li>
              <li>
                <a href="/tokens" className="text-gray-400 hover:text-white transition-colors">
                  Trending Tokens
                </a>
              </li>
              <li>
                <a href="/prices" className="text-gray-400 hover:text-white transition-colors">
                  Prices
                </a>
              </li>
              <li>
                <a href="/airdrops" className="text-gray-400 hover:text-white transition-colors">
                  Airdrops
                </a>
              </li>
              <li>
                <a href="/ai" className="text-gray-400 hover:text-white transition-colors">
                  AI News
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Data Sources</h3>
            <p className="text-gray-400 text-sm">
              Powered by CoinMarketCap, CoinGecko, CoinDesk, CoinTelegraph, Decrypt, 
              VentureBeat, and other public APIs and RSS feeds.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} VigilNet Hub. All data sourced from public APIs.</p>
        </div>
      </div>
    </footer>
  )
}

