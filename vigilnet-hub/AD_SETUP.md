# Ad Integration Setup Guide

This guide explains how to set up real advertisements in your VigilNet Hub application.

## Quick Start

1. Choose an ad network (see options below)
2. Sign up and get approved
3. Add your ad credentials to `.env.local`
4. Deploy and verify ads are displaying

## Ad Network Options

### 1. Google AdSense (Recommended for Most Sites)

**Pros:**
- Most popular and trusted
- Easy to integrate
- Good revenue potential
- Works with Next.js

**Cons:**
- May have restrictions on crypto content
- Requires approval (can take days/weeks)
- Minimum traffic requirements

**Setup Steps:**

1. Sign up at [Google AdSense](https://www.google.com/adsense/)
2. Get approved (may take 1-2 weeks)
3. Create ad units in your AdSense dashboard
4. Get your Publisher ID (format: `ca-pub-XXXXXXXXXX`)
5. Create ad slots and get Slot IDs

**Environment Variables:**
```env
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR=0987654321
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM=1122334455
NEXT_PUBLIC_AD_NETWORK=google
```

**Note:** Google AdSense may not approve crypto-related sites. If rejected, try crypto-friendly alternatives below.

---

### 2. Coinzilla (Crypto-Friendly)

**Pros:**
- Specifically for crypto sites
- Fast approval
- Good rates for crypto traffic
- Multiple ad formats

**Cons:**
- Smaller network than Google
- May have fewer advertisers

**Setup Steps:**

1. Sign up at [Coinzilla](https://www.coinzilla.com/)
2. Get approved (usually within 24-48 hours)
3. Create ad zones in dashboard
4. Get your ad code

**Environment Variables:**
```env
NEXT_PUBLIC_AD_NETWORK=coinzilla
NEXT_PUBLIC_COINZILLA_AD_CODE_TOP=<your-ad-code-here>
NEXT_PUBLIC_COINZILLA_AD_CODE_SIDEBAR=<your-ad-code-here>
NEXT_PUBLIC_COINZILLA_AD_CODE_BOTTOM=<your-ad-code-here>
```

**Usage in AdSlot component:**
```tsx
<AdSlot
  adNetwork="coinzilla"
  customAdCode={process.env.NEXT_PUBLIC_COINZILLA_AD_CODE_TOP}
  adFormat="horizontal"
/>
```

---

### 3. A-ADS (Anonymous Ads - Crypto-Friendly)

**Pros:**
- No registration required
- Crypto-friendly
- Anonymous
- Instant setup

**Cons:**
- Lower revenue potential
- Less professional appearance

**Setup Steps:**

1. Visit [A-ADS](https://a-ads.com/)
2. Get your ad code (no signup needed)
3. Use the code directly

**Usage:**
```tsx
<AdSlot
  adNetwork="custom"
  customAdCode={`<script async src="https://a-ads.com/ads/YOUR_ID.js"></script>`}
  adFormat="horizontal"
/>
```

---

### 4. Media.net (Alternative to AdSense)

**Pros:**
- Good alternative to AdSense
- Contextual ads
- May be more crypto-friendly

**Cons:**
- Requires approval
- Lower rates than AdSense typically

**Setup Steps:**

1. Sign up at [Media.net](https://www.media.net/)
2. Get approved
3. Get your ad code

**Usage:**
```tsx
<AdSlot
  adNetwork="media.net"
  customAdCode={process.env.NEXT_PUBLIC_MEDIANET_AD_CODE}
  adFormat="horizontal"
/>
```

---

### 5. PropellerAds (Pop-under & Display)

**Pros:**
- Multiple ad formats
- Good for crypto sites
- Fast approval

**Cons:**
- Pop-under ads can be intrusive
- May affect user experience

**Setup Steps:**

1. Sign up at [PropellerAds](https://propellerads.com/)
2. Get approved
3. Create ad zones
4. Get ad codes

**Usage:**
```tsx
<AdSlot
  adNetwork="propeller"
  customAdCode={process.env.NEXT_PUBLIC_PROPELLER_AD_CODE}
  adFormat="horizontal"
/>
```

---

## Implementation

### Current Setup

The app uses the `AdSlot` component which supports multiple ad networks. Update your `.env.local` file with the appropriate credentials:

```env
# Choose your ad network: 'google', 'coinzilla', 'media.net', 'propeller', or 'custom'
NEXT_PUBLIC_AD_NETWORK=google

# Google AdSense (if using)
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR=0987654321
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM=1122334455

# Or use custom ad codes for other networks
NEXT_PUBLIC_CUSTOM_AD_CODE_TOP=<your-ad-code>
NEXT_PUBLIC_CUSTOM_AD_CODE_SIDEBAR=<your-ad-code>
NEXT_PUBLIC_CUSTOM_AD_CODE_BOTTOM=<your-ad-code>
```

### Ad Slot Locations

1. **Top Banner** - Above main content (horizontal format)
2. **Sidebar** - Right sidebar (vertical format, 300x600)
3. **Bottom Banner** - Below main content (horizontal format)

### Customizing Ad Slots

Edit `app/page.tsx` to customize ad placement:

```tsx
<AdSlot
  adSlotId="custom-slot"
  adFormat="horizontal" // or 'vertical', 'rectangle', 'auto'
  googleAdClient={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
  googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_TOP}
  adNetwork="google"
  className="w-full"
/>
```

---

## Best Practices

1. **Don't overload with ads** - Too many ads hurt user experience
2. **Test on mobile** - Ensure ads are responsive
3. **Monitor performance** - Track click-through rates and revenue
4. **Comply with policies** - Follow ad network terms of service
5. **Privacy compliance** - Add cookie consent if required (GDPR, CCPA)

---

## Troubleshooting

### Ads not showing?

1. **Check environment variables** - Ensure they're set correctly
2. **Verify ad network approval** - Some networks require approval
3. **Check browser console** - Look for ad network errors
4. **Ad blockers** - Users with ad blockers won't see ads
5. **Development mode** - Some ad networks don't work in localhost

### Google AdSense not working?

- Ensure your site is approved
- Check that ad slots are created in AdSense dashboard
- Verify Publisher ID format: `ca-pub-XXXXXXXXXX`
- Wait 24-48 hours after approval for ads to start showing

### Crypto content restrictions?

- Try crypto-friendly networks: Coinzilla, A-ADS
- Some networks have stricter policies than others
- Consider affiliate marketing as alternative

---

## Alternative: Affiliate Marketing

Instead of display ads, consider:
- **Crypto exchange referrals** (Binance, Coinbase, etc.)
- **Product recommendations** (hardware wallets, tools)
- **Sponsored content** (direct partnerships)

---

## Need Help?

- Check ad network documentation
- Review Next.js documentation for script loading
- Test in production (some ads don't work in development)

