// 高德地图工具类

export interface AmapLocation {
  lng: number;
  lat: number;
  address?: string;
}

export interface AmapSearchResult {
  name: string;
  location: AmapLocation;
  address: string;
  district: string;
  city: string;
  province: string;
}

class AmapService {
  private map: any = null;
  private geocoder: any = null;
  private placeSearch: any = null;

  constructor() {
    if (typeof window !== "undefined" && window.AMap) {
      this.geocoder = new window.AMap.Geocoder();
      this.placeSearch = new window.AMap.PlaceSearch();
    }
  }

  // 初始化地图
  initMap(container: string | HTMLElement, options?: any) {
    if (!window.AMap) {
      throw new Error("高德地图API未加载");
    }

    this.map = new window.AMap.Map(container, {
      zoom: 11,
      center: [116.397428, 39.90923],
      ...options,
    });

    return this.map;
  }

  // 根据地址获取坐标
  async getLocationByAddress(address: string): Promise<AmapLocation | null> {
    if (!this.geocoder) {
      throw new Error("地理编码服务未初始化");
    }

    return new Promise((resolve, reject) => {
      this.geocoder.getLocation(address, (status: string, result: any) => {
        if (status === "complete" && result.geocodes.length > 0) {
          const location = result.geocodes[0];
          resolve({
            lng: location.location.lng,
            lat: location.location.lat,
            address: location.formattedAddress,
          });
        } else {
          reject(new Error("地址解析失败"));
        }
      });
    });
  }

  // 根据坐标获取地址
  async getAddressByLocation(lng: number, lat: number): Promise<string | null> {
    if (!this.geocoder) {
      throw new Error("地理编码服务未初始化");
    }

    return new Promise((resolve, reject) => {
      this.geocoder.getAddress([lng, lat], (status: string, result: any) => {
        if (status === "complete" && result.regeocode) {
          resolve(result.regeocode.formattedAddress);
        } else {
          reject(new Error("逆地理编码失败"));
        }
      });
    });
  }

  // 搜索地点
  async searchPlaces(
    keyword: string,
    city?: string
  ): Promise<AmapSearchResult[]> {
    if (!this.placeSearch) {
      throw new Error("地点搜索服务未初始化");
    }

    return new Promise((resolve, reject) => {
      this.placeSearch.search(keyword, (status: string, result: any) => {
        if (status === "complete" && result.poiList.pois.length > 0) {
          const pois = result.poiList.pois.map((poi: any) => ({
            name: poi.name,
            location: {
              lng: poi.location.lng,
              lat: poi.location.lat,
            },
            address: poi.address,
            district: poi.adname,
            city: poi.cityname,
            province: poi.pname,
          }));
          resolve(pois);
        } else {
          reject(new Error("搜索失败"));
        }
      });
    });
  }

  // 添加标记点
  addMarker(position: AmapLocation, options?: any) {
    if (!this.map) {
      throw new Error("地图未初始化");
    }

    const marker = new window.AMap.Marker({
      position: [position.lng, position.lat],
      ...options,
    });

    this.map.add(marker);
    return marker;
  }

  // 添加信息窗体
  addInfoWindow(marker: any, content: string) {
    if (!this.map) {
      throw new Error("地图未初始化");
    }

    const infoWindow = new window.AMap.InfoWindow({
      content,
      offset: new window.AMap.Pixel(0, -30),
    });

    marker.on("click", () => {
      infoWindow.open(this.map, marker.getPosition());
    });

    return infoWindow;
  }

  // 设置地图中心点
  setCenter(lng: number, lat: number) {
    if (!this.map) {
      throw new Error("地图未初始化");
    }

    this.map.setCenter([lng, lat]);
  }

  // 设置地图缩放级别
  setZoom(zoom: number) {
    if (!this.map) {
      throw new Error("地图未初始化");
    }

    this.map.setZoom(zoom);
  }

  // 获取地图实例
  getMap() {
    return this.map;
  }

  // 销毁地图
  destroy() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }
}

// 创建单例实例
export const amapService = new AmapService();

// 导出类型
export type { AmapLocation, AmapSearchResult };
