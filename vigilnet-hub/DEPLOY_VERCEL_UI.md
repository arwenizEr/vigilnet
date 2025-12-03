# Deploy VigilNet Hub to Vercel (UI Method)

## Step-by-Step Guide

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VigilNet Hub"
   ```

2. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `vigilnet-hub`)
   - **Don't** initialize with README, .gitignore, or license

3. **Push Your Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vigilnet-hub.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel via UI

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (use GitHub account for easiest setup)

2. **Import Your Project**:
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your GitHub account
   - Find and select `vigilnet-hub` repository
   - Click **"Import"**

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave default (or use `next build`)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables** (IMPORTANT):
   Click **"Environment Variables"** and add:

   **Optional (for database caching):**
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environments**: Production, Preview, Development (select all)
   
   **Optional (for CoinMarketCap API):**
   - **Key**: `COINMARKETCAP_API_KEY`
   - **Value**: Your CoinMarketCap API key (get from [coinmarketcap.com/api](https://coinmarketcap.com/api/))
   - **Environments**: Production, Preview, Development (select all)

   **Note**: The app works WITHOUT these! They're optional:
   - Without `DATABASE_URL`: App works, but no caching
   - Without `COINMARKETCAP_API_KEY`: Uses CoinGecko (free) instead

5. **Deploy**:
   - Click **"Deploy"** button
   - Wait for build to complete (2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Step 3: Run Database Migrations (Only if using database)

If you set `DATABASE_URL`, run migrations:

1. **Via Vercel CLI** (recommended):
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link to your project
   cd vigilnet-hub
   vercel link
   
   # Pull environment variables
   vercel env pull .env.local
   
   # Run migrations
   npx prisma migrate deploy
   ```

2. **Or manually**:
   - Get your database connection string
   - Run locally: `DATABASE_URL="your-connection-string" npx prisma migrate deploy`

### Step 4: Verify Deployment

1. **Check Build Logs**:
   - Go to your project in Vercel dashboard
   - Click on the latest deployment
   - Check "Build Logs" for any errors

2. **Test Your App**:
   - Visit your deployment URL
   - Test all pages:
     - `/` - Home page
     - `/news` - Crypto news
     - `/tokens` - Trending tokens
     - `/prices` - Real-time prices
     - `/airdrops` - Airdrops
     - `/testnets` - Testnets
     - `/ai` - AI news

### Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically configure SSL

## Troubleshooting

### Build Fails: "Prisma schema validation error"
**Solution**: 
- If not using database, remove Prisma from build
- Or set a dummy `DATABASE_URL` for build only
- Or update `package.json` build script to skip Prisma

### Build Fails: "Module not found"
**Solution**: 
- Check all dependencies are in `package.json`
- Run `npm install` locally to verify

### App Works But No Data
**Solution**: 
- Check API routes are accessible
- Check browser console for errors
- Verify external APIs (CoinGecko, RSS feeds) are accessible
- Check Vercel function logs in dashboard

### Images Not Loading
**Solution**: 
- Check `next.config.js` has all required image hostnames
- Restart deployment after config changes

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables set (optional)
- [ ] Deployment successful
- [ ] All pages working
- [ ] Database migrations run (if using database)

## Success!

Once deployed, your app will be available at:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`

The app automatically deploys on every push to your main branch! 🚀

