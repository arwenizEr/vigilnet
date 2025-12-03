import { NextResponse } from 'next/server'
import { fetchTrendingTokens } from '@/lib/fetchers'
import { prisma } from '@/prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET() {
  try {
    const tokens = await fetchTrendingTokens()

    // Cache tokens (async, don't wait)
    if (tokens.length > 0 && prisma) {
      Promise.all(
        tokens.map(async (token) => {
          try {
            await prisma.tokenCache.upsert({
              where: { coinId: token.coinId },
              update: {
                name: token.name,
                symbol: token.symbol,
                price: token.price,
                priceChange24h: token.priceChange24h,
                marketCap: token.marketCap,
                image: token.image,
                rank: token.rank,
              },
              create: {
                coinId: token.coinId,
                name: token.name,
                symbol: token.symbol,
                price: token.price,
                priceChange24h: token.priceChange24h,
                marketCap: token.marketCap,
                image: token.image,
                rank: token.rank,
              },
            })
          } catch (error) {
            // Ignore cache errors
          }
        })
      ).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/tokens:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tokens',
        data: [],
      },
      { status: 500 }
    )
  }
}

