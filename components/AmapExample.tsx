"use client";
import { useState, useEffect, useRef, memo, useMemo } from "react";
import AmapLoader from "./AmapLoader";
import { AreaItem } from "@/app/types";
interface AmapExampleProps {
  center?: { lng: number; lat: number };
  zoom?: number;
  height?: string;
  onMapClick?: (lng: number, lat: number) => void;
  markers?: Array<AreaItem>;
  onDrillDown: (id: string, detail?: boolean) => void;
}
const baseTextStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "100%",
  whiteSpace: "pre",
};
export default memo(function AmapExample({
  center = { lng: 116.397428, lat: 39.90923 },
  zoom = 11,
  height = "400px",
  onMapClick,
  markers = [],
  onDrillDown,
}: AmapExampleProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const level = useRef<0 | 1 | 2 | 3>(1);

  useEffect(() => {
    if (mapLoaded && window.AMap && mapRef.current) {
      const map = new window.AMap.Map(mapRef.current, {
        center: [center.lng, center.lat],
        zoom: zoom,
        // 性能优化配置
        renderer: "canvas", // 使用 canvas 渲染器
        mapStyle: "amap://styles/normal",
        // 禁用一些不必要的功能以提高性能
        features: ["bg", "road", "building", "point"],
        // 设置地图容器属性
        container: mapRef.current,
      });
      mapInstanceRef.current = map;

      // 使用高德地图的 complete 事件回调
      map.on("complete", () => {
        console.log("地图渲染完成，优化 Canvas 性能");
        const canvases = mapRef.current?.querySelectorAll("canvas");
        console.log("找到的 canvases:", canvases);
        canvases!.forEach((canvas) => {
          (canvas as HTMLCanvasElement).willReadFrequently = true;
          console.log("设置 Canvas willReadFrequently = true");
        });
      });
    }
  }, [mapLoaded]);

  // 单独处理 center 和 zoom 的变化
  useEffect(() => {
    if (mapInstanceRef.current) {
      // 使用 setCenter 和 setZoom 方法动态更新，而不是重新创建地图
      mapInstanceRef.current.setCenter([center.lng, center.lat]);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);
  // 存储事件监听器的引用，用于清理

  useEffect(() => {
    if (mapLoaded && window.AMap && mapInstanceRef.current) {
      // 先清空地图上的所有标记
      mapInstanceRef.current.clearMap();

      // 添加标记点
      markers.forEach((marker, index) => {
        // 验证坐标数据
        if (!marker.coord?.longitude || !marker.coord?.latitude) {
          console.warn("Invalid marker coordinates:", marker);
          return;
        }
        const lng = Number(marker.coord.longitude);
        const lat = Number(marker.coord.latitude);

        // 检查是否为有效数字
        if (isNaN(lng) || isNaN(lat)) {
          console.warn("Invalid marker coordinates (NaN):", marker);
          return;
        }

        const text = new window.AMap.Text({
          text: level.current
            ? `${marker.label}\n${marker.count}套`
            : `${marker.label}${marker.count}套`,
          anchor: "center", // 设置文本标记锚点
          cursor: "pointer",
          angle: 0,
          style: {
            lineHeight: "1.5",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            position: "absolute",
            backgroundColor: "rgba(12, 181, 106, 0.9)",
            color: "#fff",
            border: "2px solid rgba(255, 255, 255, 0.8)",
            textAlign: "center",
            cursor: "pointer",
            ...(level.current ? baseTextStyle : {}),
          },
          offset: level.current
            ? new window.AMap.Pixel(-35, -35)
            : new window.AMap.Pixel(-50, -15),
          position: new window.AMap.LngLat(lng, lat),
        });

        // 绑定点击事件
        const textClickHandler = (e: any) => {
          // 阻止事件冒泡
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
          if (e && e.preventDefault) {
            e.preventDefault();
          }

          if (!level.current) {
            onDrillDown?.(marker.value, true);
            return;
          }
          onDrillDown?.(marker.value);
          level.current = ((level.current + 1) % 3) as 0 | 1 | 2 | 3;
        };

        text.on("click", textClickHandler);
        mapInstanceRef.current?.add(text);
      });
    }
  }, [mapLoaded, markers]);

  // 清理函数
  useEffect(() => {
    return () => {
      // 销毁地图实例
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <AmapLoader
        onLoad={() => setMapLoaded(true)}
        onError={(error) => console.error("高德地图加载失败:", error)}
      />

      {mapLoaded ? (
        <div ref={mapRef} style={{ width: "100%", height }}></div>
      ) : (
        <div
          style={{
            width: "100%",
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
          }}
        >
          地图加载中...
        </div>
      )}
    </div>
  );
});
