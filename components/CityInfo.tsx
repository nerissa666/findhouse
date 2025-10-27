"use client";
import { useAppSelector } from "@/lib/hooks";
import { hasCityCoordinates, getCityMapCenter } from "@/lib/utils/cityUtils";

export default function CityInfo() {
  const city = useAppSelector((state) => state.city.currentCity);
  const hasCoordinates = hasCityCoordinates(city);
  const mapCenter = getCityMapCenter(city);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">当前城市信息</h3>
      <div className="space-y-2">
        <p>
          <strong>城市名称:</strong> {city.label}
        </p>
        <p>
          <strong>城市代码:</strong> {city.value}
        </p>

        {hasCoordinates ? (
          <div className="text-green-600">
            <p>
              <strong>坐标状态:</strong> ✅ 有坐标数据
            </p>
            <p>
              <strong>经度:</strong> {city.coord?.longitude}
            </p>
            <p>
              <strong>纬度:</strong> {city.coord?.latitude}
            </p>
            <p>
              <strong>地图中心:</strong> {mapCenter.lng.toFixed(6)},{" "}
              {mapCenter.lat.toFixed(6)}
            </p>
          </div>
        ) : (
          <div className="text-orange-600">
            <p>
              <strong>坐标状态:</strong> ⚠️ 无坐标数据，使用默认坐标
            </p>
            <p>
              <strong>默认中心:</strong> {mapCenter.lng.toFixed(6)},{" "}
              {mapCenter.lat.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
