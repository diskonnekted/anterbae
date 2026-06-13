import type { NextConfig } from "next";

// PWA disabled due to compatibility issue with @ducanh2912/next-pwa + Node.js
// The PWA manifest.json is still served from /public for browser installation support

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // Redirect old PAWON paths
  async redirects() {
    return [
      { source: '/vendors', destination: '/mitra', permanent: false },
      { source: '/vendors/:path*', destination: '/mitra', permanent: false },
      { source: '/services', destination: '/', permanent: false },
      { source: '/services/:path*', destination: '/', permanent: false },
      { source: '/inkubator', destination: '/register-courier', permanent: false },
      { source: '/inkubator/:path*', destination: '/register-courier', permanent: false },
      { source: '/lapak', destination: '/mitra', permanent: false },
      { source: '/lapak/:path*', destination: '/mitra', permanent: false },
    ]
  },
};

export default nextConfig;
// Trigger config reload
