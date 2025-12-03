# VigilNet Hub

Real-time crypto & AI content aggregation platform built with Next.js 14.

## Features

- 📰 **Crypto News** - Aggregated from CoinDesk, CoinTelegraph, Decrypt
- 🪙 **Trending Tokens** - Real-time prices from CoinGecko API
- 🎁 **Airdrops** - Scraped from airdrops.io
- 🧪 **Testnets** - Live testnet data from ChainList
- 🤖 **AI News** - Latest AI/ML news from VentureBeat, The Next Web
- ⚡ **Real-time Updates** - Live price updates every 30 seconds

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma** (PostgreSQL for production, SQLite for local dev)
- **RSS Parser** - For news feeds
- **Cheerio** - For web scraping
- **Axios** - For API calls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production/Vercel)

### Installation

1. Clone the repository:
```bash
cd vigilnet-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for local dev):
```bash
# Copy .env.example to .env (optional)
# For local development, DATABASE_URL is optional
# The app works without a database (caching is optional)

# For production/Vercel (required):
# DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**Note**: The app works without a database! Prisma caching is optional. For local development, you can skip setting `DATABASE_URL`.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd vigilnet-hub
vercel
```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - If using Vercel Postgres, use `POSTGRES_PRISMA_URL` instead

4. **Run Migrations**:
```bash
# After deployment, run migrations
npx prisma migrate deploy
```

### Using Vercel Postgres (Recommended)

1. In Vercel Dashboard, go to Storage → Create Database → Postgres
2. The connection string is automatically available as `POSTGRES_PRISMA_URL`
3. Update your Prisma schema to use `POSTGRES_PRISMA_URL` or set `DATABASE_URL` to the same value

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (for Vercel) |
| `NEXT_PUBLIC_BASE_URL` | Your app URL (auto-set by Vercel) | No |

## Project Structure

```
vigilnet-hub/
├── app/
│   ├── api/          # API routes
│   ├── page.tsx       # Home page
│   ├── news/          # News page
│   ├── tokens/        # Tokens page
│   ├── airdrops/      # Airdrops page
│   ├── testnets/      # Testnets page
│   ├── ai/            # AI news page
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles
├── components/        # React components
├── lib/               # Utility functions
│   ├── types.ts       # TypeScript types
│   ├── rss.ts         # RSS feed parser
│   ├── scraper.ts     # Web scraper
│   └── fetchers.ts    # API fetchers
└── prisma/            # Prisma schema
```

## API Routes

- `/api/news` - Crypto news from RSS feeds
- `/api/tokens` - Trending tokens from CoinGecko
- `/api/prices` - Real-time price updates
- `/api/airdrops` - Scraped airdrops
- `/api/testnets` - Testnet data from ChainList
- `/api/ai` - AI news from RSS feeds

## Data Sources

- **CoinGecko API** - Token prices and trends
- **RSS Feeds** - News from multiple sources
- **ChainList** - Testnet information
- **Web Scraping** - Airdrop data

## Features

### Real-time Price Updates
The tokens page automatically updates prices every 30 seconds using the `/api/prices` endpoint.

### Caching
Data is cached using Prisma (optional) to reduce API calls and improve performance.

### Responsive Design
Fully responsive design that works on mobile, tablet, and desktop.

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma Studio (database GUI)
npm run prisma:studio
```

## Troubleshooting

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Database Connection Issues
- Ensure `DATABASE_URL` is set correctly
- Check PostgreSQL is accessible from your network
- For Vercel, ensure SSL is enabled (`?sslmode=require`)

### API Rate Limits
Some APIs (like CoinGecko) have rate limits. The app includes caching to minimize requests.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

