/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@puiux/config',
    '@puiux/types',
    '@puiux/utils',
    '@puiux/ui',
    '@puiux/ai',
  ],

  // Enable experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'PUIUX Click',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },

  // Image optimization
  images: {
    domains: [
      'localhost',
      'puiuxclick.com',
      'storage.googleapis.com',
      'res.cloudinary.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Note: i18n removed for MVP - will be added later with next-intl or custom implementation
  // The UI is Arabic-first by default (dir="rtl" in layout)

  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Webpack config
  webpack: (config, { isServer }) => {
    // SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // TypeScript config
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint config
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },

  // Output config
  output: 'standalone',

  // Disable powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;
