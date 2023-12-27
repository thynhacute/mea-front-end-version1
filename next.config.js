/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  transpilePackages: ['antd'],
  swcMinify: true,

  env: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
