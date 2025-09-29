/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": __dirname, // <-- This makes @/ point to project root
      "@components": `${__dirname}/components`,
      "@context": `${__dirname}/context`,
      "@hooks": `${__dirname}/hooks`,
      "@lib": `${__dirname}/lib`,
    };
    return config;
  },
};

module.exports = nextConfig;
