const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React strict mode to avoid p5 sketches executing twice in dev
  reactStrictMode: false,
  webpack: (config) => {
    const alias = {
      "@": path.resolve(__dirname),
      "@components": path.resolve(__dirname, "components"),
      "@context": path.resolve(__dirname, "context"),
      "@hooks": path.resolve(__dirname, "hooks"),
      "@lib": path.resolve(__dirname, "lib"),
    };

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...alias,
    };
    return config;
  },
};

module.exports = nextConfig;
