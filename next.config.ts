import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* opções de configuração aqui */
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
