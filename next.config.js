/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'i.imgur.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Removing the experimental flag for now
  // experimental: {
  //   serverActions: true,
  // },
  // Environment specific configurations
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
};

module.exports = nextConfig;
