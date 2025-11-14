import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Declare which qualities are allowed
    qualities: [75, 80, 90, 100],
    // Permitir imagens de domínios externos (GNews)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todos os domínios HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Permite todos os domínios HTTP (para desenvolvimento)
      }
    ],
  },
};

export default nextConfig;
