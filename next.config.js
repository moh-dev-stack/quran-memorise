/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Exclude vitest config from Next.js build
    config.module.rules.push({
      test: /vitest\.config\.ts$/,
      use: 'ignore-loader',
    });
    return config;
  },
};

module.exports = nextConfig;

