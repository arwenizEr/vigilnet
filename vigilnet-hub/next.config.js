/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: '**.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
      },
      {
        protocol: 'https',
        hostname: '**.coinmarketcap.com',
      },
      {
        protocol: 'https',
        hostname: 'coindesk.com',
      },
      {
        protocol: 'https',
        hostname: '**.coindesk.com',
      },
      {
        protocol: 'https',
        hostname: 'cointelegraph.com',
      },
      {
        protocol: 'https',
        hostname: '**.cointelegraph.com',
      },
      {
        protocol: 'https',
        hostname: 'decrypt.co',
      },
      {
        protocol: 'https',
        hostname: '**.decrypt.co',
      },
      {
        protocol: 'https',
        hostname: 'venturebeat.com',
      },
      {
        protocol: 'https',
        hostname: '**.venturebeat.com',
      },
      {
        protocol: 'https',
        hostname: 'thenextweb.com',
      },
      {
        protocol: 'https',
        hostname: '**.thenextweb.com',
      },
      {
        protocol: 'https',
        hostname: 'airdrops.io',
      },
      {
        protocol: 'https',
        hostname: '**.airdrops.io',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: '**.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jwplayer.com',
      },
      {
        protocol: 'https',
        hostname: '**.jwplayer.com',
      },
      {
        protocol: 'https',
        hostname: 'img-cdn.tnwcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.tnwcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn0.tnwcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.tnwcdn.com',
      },
      // Common RSS feed image CDNs
      {
        protocol: 'https',
        hostname: '**.wp.com',
      },
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      },
      {
        protocol: 'https',
        hostname: '**.substack.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '**.sanity.io',
      },
    ],
  },
}

module.exports = nextConfig

