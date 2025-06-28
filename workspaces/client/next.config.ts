import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@last-hope/shared'],
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/:all*.(jpg|jpeg|png|gif|ico|webp|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
};

export default nextConfig;
