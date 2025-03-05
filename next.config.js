/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  images: {
    domains: ["down-vn.img.susercontent.com"],
  },
};

module.exports = nextConfig;
