"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
const AmapExample = dynamic(() => import("@/components/AmapExample"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
const LocationButton = dynamic(() => import("@/components/LocationButton"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
const HouseList = dynamic(() => import("@/components/HouseList"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
import { useAppSelector } from "@/lib/hooks";
import axios from "@/lib/axios";
import { AreaItem, House } from "@/app/types";
import { getCityMapCenter } from "@/lib/utils/cityUtils";
import { LocationData } from "@/lib/utils/locationUtils";
export default function AmapPage() {
  const city = useAppSelector((state) => state.city.currentCity);

  // const [selectedPosition, setSelectedPosition] = useState<{
  //   lng: number;
  //   lat: number;
  // } | null>(null);
  const [markers, setMarkers] = useState<AreaItem[]>([]);
  const [houseList, setHouseList] = useState<House[]>([]);
  const [details, setDetails] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [location, setLocation] = useState<string>("");
  const [locat, setLocat] = useState<string>("");
  // 获取城市坐标，如果城市有坐标则使用，否则使用默认坐标
  const mapCenter = getCityMapCenter(city);
  // 检查城市是否有坐标数据
  // const hasCoordinates = hasCityCoordinates(city);

  // 处理定位变化
  const handleLocationChange = (location: LocationData) => {
    setCurrentLocation(location);
    // 可以在这里添加其他逻辑，比如自动搜索附近的房源
  };

  const handleDrillDown = useCallback((id: string, detail?: boolean) => {
    setDetails(!!detail);

    if (detail) {
      axios.get(`/houses?cityId=${id}`).then((res) => {
        setHouseList(res.list as unknown as House[]);
      });
    } else {
      axios.get(`/area/map?id=${id}`).then((res) => {
        setMarkers(res as unknown as AreaItem[]);
      });
    }
  }, []);

  useEffect(() => {
    handleDrillDown(locat || city.value, !!locat);
  }, [locat]);
  return (
    <div className="">
      <SearchBar
        from="/amap"
        locat={setLocat}
        cpnts={{ map: false, share: false }}
      />
      {/* 定位按钮
      <div className="absolute top-20 right-4 z-10">
        <LocationButton
          onLocationChange={handleLocationChange}
          withAddress={true}
          showAddress={true}
          size="middle"
          type="primary"
        />
      </div> */}

      {/* 地图容器 */}
      <div className="h-full">
        <AmapExample
          center={
            currentLocation
              ? { lng: currentLocation.lng, lat: currentLocation.lat }
              : mapCenter
          }
          locat={locat}
          zoom={currentLocation ? 15 : 10}
          height="100vh"
          onMapClick={() => {}}
          markers={markers}
          onDrillDown={handleDrillDown}
        />
      </div>
      {details && (
        <div className="fixed bottom-0 left-0 right-0 z-100 bg-white h-[40%] overflow-y-scroll overflow-x-hidden scrollbar-hide">
          <SearchBar
            from="/amap/houseList"
            absolute={false}
            cpnts={{
              map: false,
              back: false,
              share: false,
              select: false,
              title: "房源列表",
            }}
          />
          <HouseList data={houseList} total={houseList.length} />
        </div>
      )}
    </div>
  );
}
