"use client";
import { useState } from "react";
import AmapExample from "@/components/AmapExample";
import { Button } from "antd-mobile";

export default function AmapPage() {
  const [selectedPosition, setSelectedPosition] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  const [markers, setMarkers] = useState([
    {
      position: { lng: 116.397428, lat: 39.90923 },
      title: "天安门",
      content:
        "<div style='padding: 10px;'><h4>天安门</h4><p>北京市东城区</p></div>",
    },
    {
      position: { lng: 116.407526, lat: 39.90403 },
      title: "故宫",
      content:
        "<div style='padding: 10px;'><h4>故宫博物院</h4><p>北京市东城区景山前街4号</p></div>",
    },
  ]);

  const handleMapClick = (lng: number, lat: number) => {
    setSelectedPosition({ lng, lat });
    console.log("点击位置:", { lng, lat });
  };

  const addMarker = () => {
    if (selectedPosition) {
      const newMarker = {
        position: selectedPosition,
        title: `标记点 ${markers.length + 1}`,
        content: `<div style='padding: 10px;'><h4>标记点 ${
          markers.length + 1
        }</h4><p>经度: ${selectedPosition.lng.toFixed(
          6
        )}</p><p>纬度: ${selectedPosition.lat.toFixed(6)}</p></div>`,
      };
      setMarkers([...markers, newMarker]);
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
    setSelectedPosition(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">高德地图示例</h1>

      {/* 地图容器 */}
      <div className="mb-4">
        <AmapExample
          center={{ lng: 116.397428, lat: 39.90923 }}
          zoom={12}
          height="500px"
          onMapClick={handleMapClick}
          markers={markers}
        />
      </div>

      {/* 控制面板 */}
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">地图操作</h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              color="primary"
              onClick={addMarker}
              disabled={!selectedPosition}
            >
              添加标记点
            </Button>
            <Button color="danger" onClick={clearMarkers}>
              清除所有标记
            </Button>
          </div>
        </div>

        {selectedPosition && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">选中位置</h3>
            <p>经度: {selectedPosition.lng.toFixed(6)}</p>
            <p>纬度: {selectedPosition.lat.toFixed(6)}</p>
          </div>
        )}

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">功能说明</h3>
          <ul className="text-sm space-y-1">
            <li>• 点击地图任意位置选择坐标</li>
            <li>• 点击"添加标记点"在选中位置添加标记</li>
            <li>• 点击标记点查看详细信息</li>
            <li>• 支持地图缩放和拖拽</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
