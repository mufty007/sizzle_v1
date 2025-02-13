/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
  // Add SWC configuration to fix build error
  swcMinify: false,
  // Disable unnecessary experimental features
  experimental: {
    // Disable features that might cause issues in WebContainer
    serverActions: false,
    serverComponents: false,
  },
};

module.exports = nextConfig;