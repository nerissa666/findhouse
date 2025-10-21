// 高德地图配置

export const AMAP_CONFIG = {
  // 高德地图API Key (需要替换为你的实际Key)
  API_KEY: process.env.NEXT_PUBLIC_AMAP_KEY || "YOUR_AMAP_KEY",

  // 默认地图配置
  DEFAULT_OPTIONS: {
    zoom: 11,
    center: [116.397428, 39.90923], // 北京天安门
    viewMode: "3D" as const,
    pitch: 0,
    mapStyle: "amap://styles/normal",
    resizeEnable: true,
    dragEnable: true,
    zoomEnable: true,
    doubleClickZoom: true,
    keyboardEnable: true,
    scrollWheel: true,
    touchZoom: true,
  },

  // 地图样式
  MAP_STYLES: {
    normal: "amap://styles/normal", // 标准样式
    dark: "amap://styles/dark", // 暗色样式
    light: "amap://styles/light", // 浅色样式
    fresh: "amap://styles/fresh", // 清新样式
    grey: "amap://styles/grey", // 灰色样式
    graffiti: "amap://styles/graffiti", // 涂鸦样式
    macaron: "amap://styles/macaron", // 马卡龙样式
    blue: "amap://styles/blue", // 蓝色样式
    darkblue: "amap://styles/darkblue", // 深蓝样式
    wine: "amap://styles/wine", // 酒红样式
  },

  // 常用城市坐标
  CITIES: {
    beijing: { lng: 116.397428, lat: 39.90923, name: "北京" },
    shanghai: { lng: 121.473701, lat: 31.230416, name: "上海" },
    guangzhou: { lng: 113.264385, lat: 23.129163, name: "广州" },
    shenzhen: { lng: 114.085947, lat: 22.547, name: "深圳" },
    hangzhou: { lng: 120.153576, lat: 30.287459, name: "杭州" },
    nanjing: { lng: 118.767413, lat: 32.041544, name: "南京" },
    wuhan: { lng: 114.298572, lat: 30.584355, name: "武汉" },
    chengdu: { lng: 104.066541, lat: 30.572269, name: "成都" },
    xian: { lng: 108.948024, lat: 34.263161, name: "西安" },
    chongqing: { lng: 106.504962, lat: 29.533155, name: "重庆" },
  },

  // 地图控件配置
  CONTROLS: {
    // 缩放控件
    zoom: {
      position: "RB", // 右下角
      offset: [10, 10],
    },
    // 比例尺控件
    scale: {
      position: "LB", // 左下角
      offset: [10, 10],
    },
    // 工具条控件
    toolbar: {
      position: "RT", // 右上角
      offset: [10, 10],
    },
    // 定位控件
    geolocation: {
      position: "LT", // 左上角
      offset: [10, 10],
      showButton: true,
      buttonPosition: "LB",
    },
  },
};

// 获取地图样式
export const getMapStyle = (style: keyof typeof AMAP_CONFIG.MAP_STYLES) => {
  return AMAP_CONFIG.MAP_STYLES[style] || AMAP_CONFIG.MAP_STYLES.normal;
};

// 获取城市坐标
export const getCityLocation = (city: keyof typeof AMAP_CONFIG.CITIES) => {
  return AMAP_CONFIG.CITIES[city] || AMAP_CONFIG.CITIES.beijing;
};
