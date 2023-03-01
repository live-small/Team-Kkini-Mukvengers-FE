/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/_next/image/**',
      },
    ],
  },
  compiler: {
    emotion: true,
  },
};

module.exports = nextConfig;
