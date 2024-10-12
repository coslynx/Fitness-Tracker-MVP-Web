/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.google.com'],
  },
  // ... other configurations 

  // Routing Configuration
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Sentry Configuration
  sentry: {
    disableServerSide: false,
    disableClientSide: false,
    disableServerWebpackPlugin: false,
    disableClientWebpackPlugin: false,
    silent: false,
    url: 'https://<your-sentry-url>',
    org: '<your-sentry-org>',
    project: '<your-sentry-project>',
    dsn: 'your_sentry_dsn',
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  
  // ... other configurations

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};