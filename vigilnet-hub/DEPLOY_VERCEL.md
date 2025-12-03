# Deploy VigilNet Hub to Vercel

## Quick Deploy Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Deploy to Vercel
```bash
cd vigilnet-hub
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name? (Press Enter for default or enter a name)
- Directory? **./** (current directory)
- Override settings? **No**

### 3. Set Environment Variables

After deployment, go to [Vercel Dashboard](https://vercel.com/dashboard):

1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add `DATABASE_URL`:
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environment**: Production, Preview, Development (select all)

#### Option A: Use Vercel Postgres (Recommended)

1. In Vercel Dashboard, go to **Storage** → **Create Database** → **Postgres**
2. After creation, go to **Storage** → Your database → **.env.local**
3. Copy the `POSTGRES_PRISMA_URL` value
4. Add it as `DATABASE_URL` environment variable

#### Option B: Use External PostgreSQL

Use services like:
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - Free tier available

Connection string format:
```
postgresql://user:password@host:port/database?sslmode=require
```

### 4. Run Database Migrations

After setting `DATABASE_URL`, run migrations:

```bash
# Set DATABASE_URL locally (temporarily)
export DATABASE_URL="your-connection-string"

# Or on Windows PowerShell:
$env:DATABASE_URL="your-connection-string"

# Run migrations
cd vigilnet-hub
npx prisma migrate deploy
```

Or use Vercel's build command (already configured in `vercel.json`):
- Migrations will run automatically during build if you add them to the build script

### 5. Redeploy

After setting environment variables, trigger a new deployment:

```bash
vercel --prod
```

Or push to your connected Git repository (if connected).

## Important Notes

### Database is Optional!

The app **works without a database**. Prisma caching is optional. If you don't set `DATABASE_URL`:
- ✅ App will still work
- ✅ All API routes will function
- ✅ Data will be fetched fresh from sources
- ❌ Caching won't work (but that's fine!)

### Build Command

The `vercel.json` includes:
```json
{
  "buildCommand": "prisma generate && next build"
}
```

If `DATABASE_URL` is not set, `prisma generate` will fail. To fix this:

**Option 1**: Set a dummy `DATABASE_URL` for build (not recommended)

**Option 2**: Update `package.json` build script:
```json
{
  "build": "prisma generate --schema=./prisma/schema.prisma || true && next build"
}
```

**Option 3**: Remove Prisma from build (if not using database):
```json
{
  "build": "next build"
}
```

## Troubleshooting

### Build Fails: "Prisma schema validation error"

**Solution**: Set `DATABASE_URL` in Vercel environment variables, or update the build command to skip Prisma.

### Build Fails: "Can't reach database server"

**Solution**: 
- Check `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- For external databases, ensure SSL is enabled (`?sslmode=require`)

### App Works But No Data

**Solution**: 
- Check API routes are accessible
- Check browser console for errors
- Verify external APIs (CoinGecko, RSS feeds) are accessible
- Check Vercel function logs

## Success!

Once deployed, your app will be available at:
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-git-branch.vercel.app`

The app fetches real-time data from:
- CoinGecko API (tokens/prices)
- RSS feeds (news)
- Web scraping (airdrops)
- ChainList API (testnets)

No hardcoded data - everything is live! 🚀

