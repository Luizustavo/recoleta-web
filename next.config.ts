import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Declare which qualities are allowed
    qualities: [75, 80, 90, 100],
  },
};

export default nextConfig;
