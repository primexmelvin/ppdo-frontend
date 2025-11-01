import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.thiings.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.thiings.co",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
