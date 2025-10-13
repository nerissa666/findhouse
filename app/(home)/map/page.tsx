"use client";
import axios from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Map, Marker, NavigationControl, MapApiLoaderHOC } from "react-bmapgl";

function BaiduMap() {
  const searchParams = useSearchParams();
  const value = searchParams.get("value");
  useEffect(() => {
    if (!value) return;
    axios
      .get("/area/map", {
        params: {
          id: value,
        },
      })
      .then((res) => {
        console.log("Map data:", res);
        // 这里可以根据需要处理返回的数据
      })
      .catch((err) => {
        console.error("Error fetching map data:", err);
      });
  }, [value]); // 依赖 value，只有 value 变化时才会重新请求

  return (
    <div className="w-full" style={{ height: "100vh" }}>
      <Map
        center={{ lng: 116.402544, lat: 39.928216 }}
        zoom="11"
        style={{ height: "100%" }}
      >
        <Marker position={{ lng: 116.402544, lat: 39.928216 }} />
        <NavigationControl />
      </Map>
    </div>
  );
}
export default MapApiLoaderHOC({ ak: "LC5jwjjdL5wPhGc3PAMNVwfvzTvlw8i0" })(
  BaiduMap
);
