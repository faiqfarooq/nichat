/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  reactStrictMode: true,
  swcMinify: true,
  
  // Image configuration
  images: {
    domains: ["res.cloudinary.com", "i.pravatar.cc", "lh3.googleusercontent.com", "i.imgur.com"],
  },
  
  // Disable static generation
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
};

module.exports = nextConfig;
