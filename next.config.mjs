/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/geocode',
        destination: 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
      },
    ];
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/match',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
