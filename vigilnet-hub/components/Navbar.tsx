import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                VigilNet Hub
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-center max-w-md mx-4">
            <SearchBar />
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/news"
              className="text-gray-300 hover:text-white transition-colors"
            >
              News
            </Link>
            <Link
              href="/tokens"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Tokens
            </Link>
            <Link
              href="/prices"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Prices
            </Link>
            <Link
              href="/analytics"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/defi"
              className="text-gray-300 hover:text-white transition-colors"
            >
              DeFi
            </Link>
            <Link
              href="/exchanges"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Exchanges
            </Link>
            <Link
              href="/watchlist"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Watchlist
            </Link>
            <Link
              href="/compare"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Compare
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

