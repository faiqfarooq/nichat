/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'i.imgur.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  // Removing the experimental flag for now
  // experimental: {
  //   serverActions: true,
  // },
};

module.exports = nextConfig;