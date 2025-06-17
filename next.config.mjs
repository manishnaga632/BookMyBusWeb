/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gst-contracts.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  // Remove the experimental option as it's no longer needed in Next.js 15
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
  output: 'standalone',
};

export default nextConfig;