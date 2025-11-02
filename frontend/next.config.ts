/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5196",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
