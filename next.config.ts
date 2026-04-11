import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/solutions",
  assetPrefix: "/solutions",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/solutions",
        basePath: false,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
