/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "bucket.pavarit.net",
      },
    ],
  },
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.joblib$/,
      use: "raw-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
