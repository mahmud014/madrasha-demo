import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // এটি ৫শিউ (502) এরর ফিক্স করবে এবং সব এক্সটার্নাল ইমেজ লোড হতে সাহায্য করবে
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // এটি সব ডোমেইন অ্যালাউ করবে, যা গ্যালারির জন্য ভালো
      },
    ],
  },
  // যদি আপনার API Route এ সমস্যা থাকে, তবে নিচের অংশটুকু যোগ করতে পারেন
  experimental: {
    serverActions: {
      allowedOrigins: ["madrashamanagement.netlify.app", "localhost:3000"],
    },
  },
};

export default nextConfig;
