import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://randomuser.me/api/**')],
  },
};

export default nextConfig;
