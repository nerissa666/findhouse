"use client";
import { useEffect } from "react";

interface BaiduMapLoaderProps {
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function BaiduMapLoader({
  onLoad,
  onError,
}: BaiduMapLoaderProps) {
  useEffect(() => {
    // 检查是否已经加载了百度地图 API
    if (window.BMap) {
      onLoad?.();
      return;
    }

    // 检查是否已经在加载中
    if (window.baiduMapLoading) {
      return;
    }

    window.baiduMapLoading = true;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=mzBY3pLQTnguP3a9yriGkb3sRPoidbNE&callback=initBaiduMap`;
    script.async = true;
    script.defer = true;

    // 设置全局回调函数
    window.initBaiduMap = () => {
      window.baiduMapLoading = false;
      onLoad?.();
    };

    script.onerror = () => {
      window.baiduMapLoading = false;
      onError?.(new Error("Failed to load Baidu Map API"));
    };

    document.head.appendChild(script);

    // 清理函数
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initBaiduMap;
      delete window.baiduMapLoading;
    };
  }, [onLoad, onError]);

  return null;
}

// 扩展 Window 接口
declare global {
  interface Window {
    BMap: any;
    initBaiduMap: () => void;
    baiduMapLoading: boolean;
  }
}
