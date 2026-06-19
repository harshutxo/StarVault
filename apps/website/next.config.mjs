/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@starvault/protocol", "@starvault/shared-types"]
};

export default nextConfig;
