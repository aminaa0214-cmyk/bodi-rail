import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Онлайн анкетын хавсралт файлуудад зориулав (lib/application.ts → MAX_TOTAL_BYTES = 4 MB).
      // Vercel нэг хүсэлтэд 4.5 MB-аас ихийг хүлээж авдаггүй.
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
