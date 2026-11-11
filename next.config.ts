import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 export: 서버 없이 배포 가능, 추후 Capacitor 래핑 대비
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
