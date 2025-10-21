"use client";
import { useState, useEffect } from "react";
import BaiduMapLoader from "./BaiduMapLoader";

export default function MapExample() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    if (mapLoaded && window.BMap) {
      // 创建地图实例
      const map = new window.BMap.Map("mapContainer");
      const point = new window.BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
      setMapInstance(map);
    }
  }, [mapLoaded]);

  return (
    <div>
      <BaiduMapLoader
        onLoad={() => setMapLoaded(true)}
        onError={(error) => console.error("地图加载失败:", error)}
      />

      {mapLoaded ? (
        <div id="mapContainer" style={{ width: "100%", height: "400px" }}></div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          地图加载中...
        </div>
      )}
    </div>
  );
}
