/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "bucket.pavarit.net",
      },
    ],
  },
};

module.exports = nextConfig;
