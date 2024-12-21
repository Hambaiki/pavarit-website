/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "bucket.pavarit.net",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.joblib$/,
      use: "raw-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
