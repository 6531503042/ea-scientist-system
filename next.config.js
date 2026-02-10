const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Set output file tracing root for standalone builds
  outputFileTracingRoot: __dirname,
  // Enable standalone output for Docker
  output: "standalone",
}

module.exports = nextConfig
