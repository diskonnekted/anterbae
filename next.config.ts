import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
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
