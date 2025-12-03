# Quick Start Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

**That's it!** The app works without a database. All data is fetched live from APIs.

## Deploy to Vercel

### Option 1: Without Database (Simplest)

1. **Deploy:**
   ```bash
   vercel
   ```

2. **Done!** The app will work without `DATABASE_URL` (caching disabled).

### Option 2: With Database (Recommended for Production)

1. **Create Vercel Postgres:**
   - Go to Vercel Dashboard → Storage → Create Database → Postgres
   - Copy the connection string

2. **Set environment variable:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` with the connection string

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Run migrations (one-time):**
   ```bash
   npx prisma migrate deploy
   ```

## What Works

✅ **Crypto News** - Live RSS feeds from CoinDesk, CoinTelegraph, Decrypt  
✅ **Trending Tokens** - Real-time prices from CoinGecko  
✅ **Real-time Price Updates** - Auto-updates every 30 seconds  
✅ **Airdrops** - Scraped from airdrops.io  
✅ **Testnets** - Live data from ChainList  
✅ **AI News** - Latest from VentureBeat, The Next Web  

## No Hardcoded Data!

Everything is fetched from real APIs and RSS feeds. The app is fully dynamic and updates in real-time.

## Troubleshooting

**Build fails?** Make sure `DATABASE_URL` is set in Vercel if you want caching, or leave it unset to skip Prisma.

**No data showing?** Check:
- External APIs are accessible (CoinGecko, RSS feeds)
- Browser console for errors
- Vercel function logs

**Prisma errors?** Database is optional! The app works without it.

