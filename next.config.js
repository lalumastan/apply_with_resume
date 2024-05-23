/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icsdiscover.great-site.net',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
