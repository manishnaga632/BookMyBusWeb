/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'gst-contracts.s3.ap-southeast-1.amazonaws.com',
      pathname: '/**',
    }],
    // Add these for better image optimization
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    // Add this for better client-side navigation
    clientRouterFilter: true,
  },
  output: 'standalone',
  // Add compiler for styled-components if using
  compiler: {
    styledComponents: true,
  },
  // Enable React Strict Mode
  reactStrictMode: true
};