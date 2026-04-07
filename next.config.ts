import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/courses",
  assetPrefix: "/courses",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/courses",
        basePath: false,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
