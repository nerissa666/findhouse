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

    // 创建script标签加载高德地图API
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.NEXT_PUBLIC_AMAP_KEY}&callback=initAMap`;
    script.async = true;
    script.defer = true;

    // 设置全局回调函数
    (window as any).initAMap = () => {
      setLoaded(true);
      onLoad();
    };

    script.onerror = (error) => {
      console.error("高德地图加载失败:", error);
      onError(error);
    };

    document.head.appendChild(script);

    return () => {
      // 清理
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any).initAMap;
    };
  }, [onLoad, onError]);

  return null;
}
