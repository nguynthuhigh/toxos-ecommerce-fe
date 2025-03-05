/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  images: {
    domains: ["down-vn.img.susercontent.com", "curxor-tracking.netlify.app"],
  },
};

module.exports = nextConfig;
