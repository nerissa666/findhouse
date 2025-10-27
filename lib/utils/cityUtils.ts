import { SelectOption, Coord } from "@/app/types";

/**
 * 获取城市的地图中心点坐标
 * @param city 城市数据
 * @returns 地图中心点坐标
 */
export const getCityMapCenter = (
  city: SelectOption
): { lng: number; lat: number } => {
  console.log("city", city);
  if (city.coord) {
    return {
      lng: parseFloat(city.coord.longitude),
      lat: parseFloat(city.coord.latitude),
    };
  }

  // 默认坐标（北京）
  return { lng: 116.397428, lat: 39.90923 };
};

/**
 * 检查城市是否有坐标数据
 * @param city 城市数据
 * @returns 是否有坐标
 */
export const hasCityCoordinates = (city: SelectOption): boolean => {
  return !!(city.coord && city.coord.longitude && city.coord.latitude);
};

/**
 * 格式化城市坐标数据
 * @param coord 坐标数据
 * @returns 格式化后的坐标
 */
export const formatCityCoordinates = (
  coord: Coord
): { lng: number; lat: number } => {
  return {
    lng: parseFloat(coord.longitude),
    lat: parseFloat(coord.latitude),
  };
};

/**
 * 计算两个城市之间的距离（简单估算）
 * @param city1 城市1
 * @param city2 城市2
 * @returns 距离（公里）
 */
export const calculateCityDistance = (
  city1: SelectOption,
  city2: SelectOption
): number | null => {
  if (!hasCityCoordinates(city1) || !hasCityCoordinates(city2)) {
    return null;
  }

  const coord1 = formatCityCoordinates(city1.coord!);
  const coord2 = formatCityCoordinates(city2.coord!);

  // 使用 Haversine 公式计算距离
  const R = 6371; // 地球半径（公里）
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
};
