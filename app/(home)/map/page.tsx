"use client";
import React from "react";
import { Map, Marker, NavigationControl, MapApiLoaderHOC } from "react-bmapgl";

function BaiduMap() {
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
