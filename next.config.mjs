/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['three'],
  async rewrites() {
    return [
      {
        source: '/formacao/_next/:path*',
        destination: 'https://allos-formacao-production.up.railway.app/_next/:path*',
      },
      {
        source: '/formacao/:path*',
        destination: 'https://allos-formacao-production.up.railway.app/formacao/:path*',
      },
    ];
  },
};

export default nextConfig;
