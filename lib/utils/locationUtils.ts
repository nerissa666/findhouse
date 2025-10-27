/**
 * 定位相关的工具函数
 */

export interface LocationData {
  lng: number;
  lat: number;
  address?: string;
  accuracy?: number;
}

export interface LocationError {
  code: number;
  message: string;
}

/**
 * 获取用户当前位置
 * @param options 定位选项
 * @returns Promise<LocationData>
 */
export const getCurrentLocation = (
  options: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  } = {}
): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持定位
    if (!navigator.geolocation) {
      reject({
        code: -1,
        message: "您的浏览器不支持定位功能",
      });
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true, // 启用高精度定位
      timeout: 10000, // 10秒超时
      maximumAge: 300000, // 5分钟内的缓存位置
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude, accuracy } = position.coords;
        resolve({
          lng: longitude,
          lat: latitude,
          accuracy,
        });
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "用户拒绝了定位请求";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "定位信息不可用";
            break;
          case error.TIMEOUT:
            errorMessage = "定位请求超时";
            break;
          default:
            errorMessage = "定位失败，未知错误";
            break;
        }
        reject({
          code: error.code,
          message: errorMessage,
        });
      },
      defaultOptions
    );
  });
};

/**
 * 监听位置变化
 * @param callback 位置变化回调
 * @param options 定位选项
 * @returns 清除监听的函数
 */
export const watchLocation = (
  callback: (location: LocationData) => void,
  options: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  } = {}
) => {
  if (!navigator.geolocation) {
    throw new Error("您的浏览器不支持定位功能");
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
    ...options,
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude, accuracy } = position.coords;
      callback({
        lng: longitude,
        lat: latitude,
        accuracy,
      });
    },
    (error) => {
      console.error("位置监听失败:", error);
    },
    defaultOptions
  );

  // 返回清除监听的函数
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
};

/**
 * 根据坐标获取地址信息（使用高德地图逆地理编码）
 * @param lng 经度
 * @param lat 纬度
 * @returns Promise<string>
 */
export const getAddressByLocation = async (
  lng: number,
  lat: number
): Promise<string> => {
  try {
    // 使用高德地图逆地理编码API
    const response = await fetch(
      `https://restapi.amap.com/v3/geocode/regeo?key=${process.env.NEXT_PUBLIC_AMAP_KEY}&location=${lng},${lat}&poitype=&radius=1000&extensions=all&batch=false&roadlevel=0`
    );

    const data = await response.json();

    if (data.status === "1" && data.regeocode) {
      return data.regeocode.formatted_address;
    }

    throw new Error("地址解析失败");
  } catch (error) {
    console.error("获取地址失败:", error);
    return "地址解析失败";
  }
};

/**
 * 获取完整的定位信息（包含地址）
 * @param options 定位选项
 * @returns Promise<LocationData>
 */
export const getCurrentLocationWithAddress = async (
  options: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  } = {}
): Promise<LocationData> => {
  const location = await getCurrentLocation(options);

  try {
    const address = await getAddressByLocation(location.lng, location.lat);
    return {
      ...location,
      address,
    };
  } catch (error) {
    console.error("获取地址失败:", error);
    return location;
  }
};

/**
 * 检查浏览器是否支持定位
 * @returns boolean
 */
export const isLocationSupported = (): boolean => {
  return "geolocation" in navigator;
};

/**
 * 检查定位权限状态
 * @returns Promise<'granted' | 'denied' | 'prompt' | 'unknown'>
 */
export const checkLocationPermission = async (): Promise<
  "granted" | "denied" | "prompt" | "unknown"
> => {
  if (!("permissions" in navigator)) {
    return "unknown";
  }

  try {
    const permission = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return permission.state;
  } catch (error) {
    console.error("检查定位权限失败:", error);
    return "unknown";
  }
};
