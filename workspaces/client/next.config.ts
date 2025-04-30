import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@last-hope/shared'],
  devIndicators: false,
};

export default nextConfig;
