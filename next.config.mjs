/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ENDPOINT: process.env.ENDPOINT,
    API_PREFIX_IDENTITY: process.env.API_PREFIX_IDENTITY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
