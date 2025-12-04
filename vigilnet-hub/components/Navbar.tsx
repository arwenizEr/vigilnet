'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from './SearchBar'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                VigilNet Hub
              </span>
            </Link>
          </div>
          
          {/* Desktop: Search Bar - Centered (hidden on medium, shown on large+) */}
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-lg mx-8">
            <SearchBar />
          </div>
          
          {/* Desktop: Navigation Links (shown on medium+) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 flex-shrink-0">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/news"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              News
            </Link>
            <Link
              href="/tokens"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Tokens
            </Link>
            <Link
              href="/prices"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Prices
            </Link>
            <Link
              href="/analytics"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Analytics
            </Link>
            <Link
              href="/defi"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              DeFi
            </Link>
            <Link
              href="/exchanges"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Exchanges
            </Link>
            <Link
              href="/watchlist"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Watchlist
            </Link>
            <Link
              href="/compare"
              className="text-gray-300 hover:text-white transition-colors px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              Compare
            </Link>
          </div>

          {/* Mobile: Search and Menu Button */}
          <div className="md:hidden flex items-center space-x-2 flex-1">
            <div className="flex-1 max-w-xs">
              <SearchBar />
            </div>
            <button 
              className="text-gray-300 hover:text-white p-2 -mr-2 touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/news"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/tokens"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tokens
              </Link>
              <Link
                href="/prices"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prices
              </Link>
              <Link
                href="/analytics"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/defi"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                DeFi
              </Link>
              <Link
                href="/exchanges"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Exchanges
              </Link>
              <Link
                href="/watchlist"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Watchlist
              </Link>
              <Link
                href="/compare"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Compare
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

