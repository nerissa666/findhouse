"use client";
import { useState, useEffect, useRef } from "react";
import AmapLoader from "./AmapLoader";

interface AmapExampleProps {
  center?: { lng: number; lat: number };
  zoom?: number;
  height?: string;
  onMapClick?: (lng: number, lat: number) => void;
  markers?: Array<{
    position: { lng: number; lat: number };
    title?: string;
    content?: string;
  }>;
}

export default function AmapExample({
  center = { lng: 116.397428, lat: 39.90923 },
  zoom = 11,
  height = "400px",
  onMapClick,
  markers = [],
}: AmapExampleProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapLoaded && window.AMap && mapRef.current) {
      // 创建地图实例
      const map = new window.AMap.Map(mapRef.current, {
        center: [center.lng, center.lat],
        zoom: zoom,
        viewMode: "3D", // 3D视图
        pitch: 0, // 俯仰角
        mapStyle: "amap://styles/normal", // 地图样式
      });

      // 添加地图点击事件
      if (onMapClick) {
        map.on("click", (e: any) => {
          const { lng, lat } = e.lnglat;
          onMapClick(lng, lat);
        });
      }

      // 添加标记点
      markers.forEach((marker) => {
        const markerInstance = new window.AMap.Marker({
          position: [marker.position.lng, marker.position.lat],
          title: marker.title,
        });

        // 添加信息窗体
        if (marker.content) {
          const infoWindow = new window.AMap.InfoWindow({
            content: marker.content,
            offset: new window.AMap.Pixel(0, -30),
          });

          markerInstance.on("click", () => {
            infoWindow.open(map, markerInstance.getPosition());
          });
        }

        map.add(markerInstance);
      });

      setMapInstance(map);

      return () => {
        if (map) {
          map.destroy();
        }
      };
    }
  }, [mapLoaded, center, zoom, onMapClick, markers]);

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
}
