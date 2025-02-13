/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      }
    ],
    unoptimized: true,
    domains: ['images.unsplash.com', 'api.dicebear.com']
  },
  // Disable SWC minification for WebContainer compatibility
  swcMinify: false,
  // Disable telemetry
  telemetry: false,
  // Disable React strict mode for WebContainer compatibility
  reactStrictMode: false,
  // Ignore build errors temporarily
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize for WebContainer environment
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    webpackBuildWorker: false,
  },
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  },
};

module.exports = nextConfig;