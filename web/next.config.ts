import type { NextConfig } from "next";

// Админ хуудсаас оруулсан зургууд Supabase Storage-ийн "site-images" bucket-д хадгалагдана
const supabaseImages = process.env.SUPABASE_URL
  ? [new URL(`${process.env.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/site-images/**`)]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImages,
  },
  experimental: {
    serverActions: {
      // Онлайн анкетын хавсралт файлуудад зориулав (lib/application.ts → MAX_TOTAL_BYTES = 4 MB).
      // Vercel нэг хүсэлтэд 4.5 MB-аас ихийг хүлээж авдаггүй.
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
