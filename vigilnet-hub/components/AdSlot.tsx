'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  adSlotId?: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
  // For Google AdSense
  googleAdClient?: string
  googleAdSlot?: string
  // For other ad networks
  adNetwork?: 'google' | 'media.net' | 'propeller' | 'coinzilla' | 'custom'
  customAdCode?: string
  // Show placeholder if no ads configured
  showPlaceholder?: boolean
}

export default function AdSlot({
  adSlotId = 'ad-slot',
  adFormat = 'auto',
  style,
  className = '',
  googleAdClient,
  googleAdSlot,
  adNetwork = 'google',
  customAdCode,
  showPlaceholder = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const hasAdConfig = (adNetwork === 'google' && googleAdClient) || (customAdCode && customAdCode.trim() !== '')

  useEffect(() => {
    if (!adRef.current || !hasAdConfig) return

    // Google AdSense integration
    if (adNetwork === 'google' && googleAdClient) {
      // Check if script is already in document
      const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`)
      
      if (existingScript) {
        // Script already loaded, just push the ad
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (e) {
          console.error('AdSense error:', e)
        }
      } else {
        // Load AdSense script
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdClient}`
        script.async = true
        script.crossOrigin = 'anonymous'
        script.onload = () => {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
          } catch (e) {
            console.error('AdSense error:', e)
          }
        }
        script.onerror = () => {
          console.error('Failed to load AdSense script')
        }
        document.head.appendChild(script)
      }
    }

    // Media.net integration
    if (adNetwork === 'media.net' && customAdCode) {
      adRef.current.innerHTML = customAdCode
    }

    // PropellerAds integration
    if (adNetwork === 'propeller' && customAdCode) {
      adRef.current.innerHTML = customAdCode
    }

    // Coinzilla (crypto-friendly) integration
    if (adNetwork === 'coinzilla' && customAdCode) {
      adRef.current.innerHTML = customAdCode
    }

    // Custom ad code
    if (adNetwork === 'custom' && customAdCode) {
      adRef.current.innerHTML = customAdCode
    }
  }, [adNetwork, googleAdClient, customAdCode, hasAdConfig])

  // Get dimensions based on format
  const getDimensions = () => {
    switch (adFormat) {
      case 'rectangle':
        return { width: '300', height: '250' }
      case 'vertical':
        return { width: '300', height: '600' }
      case 'horizontal':
        return { width: '728', height: '90' }
      default:
        return { width: 'auto', height: 'auto' }
    }
  }

  const dimensions = getDimensions()

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center ${className}`}
      style={{ minHeight: dimensions.height === 'auto' ? '100px' : `${dimensions.height}px`, ...style }}
    >
      {adNetwork === 'google' && googleAdClient ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: dimensions.width, height: dimensions.height }}
          data-ad-client={googleAdClient}
          data-ad-slot={googleAdSlot || adSlotId}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          ref={adRef}
          className="w-full h-full flex items-center justify-center"
          style={{ minHeight: dimensions.height === 'auto' ? '100px' : `${dimensions.height}px` }}
        >
          {(!hasAdConfig && showPlaceholder) && (
            <div className="text-center p-4">
              <p className="text-gray-500 text-sm mb-2">Advertisement</p>
              <p className="text-gray-600 text-xs">
                {process.env.NODE_ENV === 'development' 
                  ? 'Configure ad network in .env.local (see AD_SETUP.md)'
                  : 'Ad Space'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

