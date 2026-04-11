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
      // Proxy formacao API routes (ranking, meet, sync-groups)
      {
        source: '/api/ranking/:path*',
        destination: 'https://allos-formacao-production.up.railway.app/api/ranking/:path*',
      },
      {
        source: '/api/ranking',
        destination: 'https://allos-formacao-production.up.railway.app/api/ranking',
      },
      {
        source: '/api/meet-presenca/:path*',
        destination: 'https://allos-formacao-production.up.railway.app/api/meet-presenca/:path*',
      },
      {
        source: '/api/meet-presenca',
        destination: 'https://allos-formacao-production.up.railway.app/api/meet-presenca',
      },
      {
        source: '/api/meet-condutores',
        destination: 'https://allos-formacao-production.up.railway.app/api/meet-condutores',
      },
      {
        source: '/api/meet-slots-hoje',
        destination: 'https://allos-formacao-production.up.railway.app/api/meet-slots-hoje',
      },
      {
        source: '/api/sync-groups',
        destination: 'https://allos-formacao-production.up.railway.app/api/sync-groups',
      },
      {
        source: '/formacao/:path*',
        destination: 'https://allos-formacao-production.up.railway.app/formacao/:path*',
      },
    ];
  },
};

export default nextConfig;
