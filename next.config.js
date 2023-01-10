/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    NEST_HOST: process.env.NEST_HOST, // TO BE ABLE TO USE ON CLIENT SIDE
    NEXT_HOST: process.env.NEXT_HOST,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    NEST_HOST: process.env.NEST_HOST, // TO BE ABLE TO USE ON CLIENT SIDE
    NEXT_HOST: process.env.NEXT_HOST,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEST_HOST: process.env.NEST_HOST, // TO BE ABLE TO USE ON CLIENT SIDE
    NEXT_HOST: process.env.NEXT_HOST,
  },
};

module.exports = nextConfig;
