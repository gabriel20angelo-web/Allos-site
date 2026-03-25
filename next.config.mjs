/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['three'],
  async rewrites() {
    return [
      {
        source: '/formacao/:path*',
        destination: 'https://allos-formacao-production.up.railway.app/formacao/:path*',
      },
    ];
  },
};

export default nextConfig;
