import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/img/:path*",
        destination: "http://localhost:8080/img/:path*",
      },
    ];
  },
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/img",
  //       destination: "http://localhost:8080",
  //       permanent: true, // 这表示是一个永久重定向（HTTP 301 状态码）
  //     },
  //   ];
  // },
};

export default nextConfig;
