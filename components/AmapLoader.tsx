"use client";
import { useEffect, useState } from "react";

interface AmapLoaderProps {
  onLoad: () => void;
  onError: (error: any) => void;
}

export default function AmapLoader({ onLoad, onError }: AmapLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 检查是否已经加载过
    if (window.AMap) {
      setLoaded(true);
      onLoad();
      return;
    }

    // 使用动态导入方式加载
    const loadAMap = async () => {
      try {
        // 创建script标签加载高德地图API
        const script = document.createElement("script");
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.NEXT_PUBLIC_AMAP_KEY}`;
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";

        // 等待脚本加载完成
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // 等待AMap对象可用
        const checkAMap = () => {
          if (window.AMap) {
            setLoaded(true);
            onLoad();
          } else {
            setTimeout(checkAMap, 100);
          }
        };
        checkAMap();
      } catch (error) {
        console.error("高德地图加载失败:", error);
        onError(error);
      }
    };

    loadAMap();
  }, [onLoad, onError]);

  return null;
}
