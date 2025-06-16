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
  };
  
  export default nextConfig;
  