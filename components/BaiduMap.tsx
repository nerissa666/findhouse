"use client";
// components/BaiduMap.tsx
import React, { useEffect } from "react";

const BaiduMap = () => {
  if (window.BMapGL) {
    window.initBaiduMap = () => {
      const map = new window.BMapGL.Map("map-container");
      const point = new window.BMapGL.Point(116.404, 39.915);
      map.centerAndZoom(point, 11);
      const marker = new window.BMapGL.Marker(point);
      map.addOverlay(marker);
    };
  }

  return (
    <div id="map-container" style={{ width: "100%", height: "400px" }}></div>
  );
};

export default BaiduMap;
