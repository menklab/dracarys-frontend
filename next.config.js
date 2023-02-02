/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    NEST_HOST: process.env.NEST_HOST, // TO BE ABLE TO USE ON CLIENT SIDE
    NEXT_HOST: process.env.NEXT_HOST,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
