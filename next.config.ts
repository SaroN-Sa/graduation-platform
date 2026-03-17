import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pvbvsekxtpysecskjeoy.supabase.co",
      },
    ],
  },
};

export default nextConfig;
