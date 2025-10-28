"use client";
import { useState, useEffect, useRef } from "react";
import AmapLoader from "./AmapLoader";

interface CommunityMapProps {
  community: string;
  coord?: {
    longitude: string;
    latitude: string;
  };
  height?: string;
}

export default function CommunityMap({
  community,
  coord,
  height = "145px",
}: CommunityMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // 通过地址获取坐标的函数
  const getCoordinatesByAddress = async (address: string) => {
    try {
      console.log("正在解析地址:", address);

      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/geo?key=${
          process.env.NEXT_PUBLIC_AMAP_KEY
        }&address=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("地址解析响应:", data);

      if (data.status === "1" && data.geocodes && data.geocodes.length > 0) {
        const location = data.geocodes[0].location.split(",");
        const coordinates = {
          lng: parseFloat(location[0]),
          lat: parseFloat(location[1]),
        };
        console.log("解析到的坐标:", coordinates);
        return coordinates;
      } else {
        console.warn("地址解析失败:", data.info || "未知错误");
        return null;
      }
    } catch (error) {
      console.error("地址解析失败:", error);
      return null;
    }
  };

  // 初始化地图
  useEffect(() => {
    const initMap = async () => {
      if (!mapLoaded || !window.AMap || !mapRef.current) return;

      setLoading(true);

      try {
        let center = { lng: 116.397428, lat: 39.90923 }; // 默认北京坐标

        // 如果有坐标数据，直接使用
        if (coord?.longitude && coord?.latitude) {
          center = {
            lng: parseFloat(coord.longitude),
            lat: parseFloat(coord.latitude),
          };
        } else if (community) {
          // 通过小区名称获取坐标
          const coordinates = await getCoordinatesByAddress(community);
          if (coordinates) {
            center = coordinates;
          }
        }

        console.log("创建地图实例，中心点:", center);

        // 创建地图实例
        const map = new window.AMap.Map(mapRef.current, {
          center: [center.lng, center.lat],
          zoom: 15,
          mapStyle: "amap://styles/normal",
          features: ["bg", "road", "building", "point"],
        });

        mapInstanceRef.current = map;

        // 添加小区标记
        const marker = new window.AMap.Marker({
          position: [center.lng, center.lat],
          title: community,
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(25, 34),
            image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
            imageSize: new window.AMap.Size(25, 34),
          }),
        });

        // 添加信息窗体
        const infoWindow = new window.AMap.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 120px;">
              <h4 style="margin: 0 0 5px 0; color: #333; font-size: 14px;">${community}</h4>
              <p style="margin: 0; color: #666; font-size: 12px;">小区位置</p>
            </div>
          `,
          offset: new window.AMap.Pixel(0, -30),
        });

        map.add(marker);
        map.add(infoWindow);

        // 点击标记显示信息窗体
        marker.on("click", () => {
          infoWindow.open(map, marker.getPosition());
        });

        console.log("地图标记添加完成");

        // 地图加载完成
        map.on("complete", () => {
          setLoading(false);
          console.log("小区地图加载完成");
        });
      } catch (error) {
        console.error("地图初始化失败:", error);
        setLoading(false);
      }
    };

    initMap();
  }, [mapLoaded, community, coord]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <AmapLoader
        onLoad={() => setMapLoaded(true)}
        onError={(error) => {
          console.error("高德地图加载失败:", error);
          setLoading(false);
        }}
      />

      {mapLoaded ? (
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "4px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            color: "#999",
            fontSize: "14px",
          }}
        >
          {loading ? "地图加载中..." : "地图加载失败"}
        </div>
      )}
    </div>
  );
}
