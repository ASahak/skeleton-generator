/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/root',
      },
    ]
  },
};

export default nextConfig;
