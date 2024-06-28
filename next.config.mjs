/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/',
            destination: '/schedule',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
