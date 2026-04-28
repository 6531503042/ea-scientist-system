const path = require("path");

function getApiOrigin() {
  const configuredOrigin =
    process.env.API_ORIGIN ||
    process.env.NEXT_PUBLIC_API_ORIGIN ||
    "http://127.0.0.1:3000";

  try {
    const url = new URL(configuredOrigin);

    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return "http://127.0.0.1:3000";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    const apiOrigin = getApiOrigin();

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Set output file tracing root for standalone builds
  outputFileTracingRoot: __dirname,
  // Enable standalone output for Docker
  output: "standalone",
};

module.exports = nextConfig;
