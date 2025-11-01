import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置子路径，所有内部链接和静态资源都会自动加上 /findhouse 前缀
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/img/**",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/img/:path*",
        destination: "http://localhost:8080/img/:path*",
      },
    ];
  },
  // 设置环境变量来抑制 antd-mobile 的版本警告
  env: {
    SUPPRESS_ANTD_MOBILE_VERSION_WARNING: "true",
  },
  // 忽略构建时的 TypeScript 类型错误
  typescript: {
    ignoreBuildErrors: true,
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
