import { NextResponse } from 'next/server'
import { scrapeAirdrops } from '@/lib/scraper'
import { prisma } from '@/prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Revalidate every 10 minutes

export async function GET() {
  try {
    const airdrops = await scrapeAirdrops()

    // Cache airdrops (async, don't wait)
    if (airdrops.length > 0 && prisma) {
      Promise.all(
        airdrops.map(async (airdrop) => {
          try {
            await prisma.airdropCache.upsert({
              where: { link: airdrop.link },
              update: {
                title: airdrop.title,
                reward: airdrop.reward,
                category: airdrop.category,
                status: airdrop.status,
              },
              create: {
                title: airdrop.title,
                link: airdrop.link,
                reward: airdrop.reward,
                category: airdrop.category,
                status: airdrop.status,
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
      data: airdrops,
      count: airdrops.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in /api/airdrops:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch airdrops',
        data: [],
      },
      { status: 500 }
    )
  }
}

