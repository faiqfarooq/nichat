/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "i.pravatar.cc", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
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
