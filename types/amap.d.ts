// 高德地图类型定义

declare global {
  interface Window {
    AMap: any;
    initAMap: () => void;
  }
}

export interface AmapMapOptions {
  center?: [number, number];
  zoom?: number;
  viewMode?: "2D" | "3D";
  pitch?: number;
  mapStyle?: string;
  resizeEnable?: boolean;
  dragEnable?: boolean;
  zoomEnable?: boolean;
  doubleClickZoom?: boolean;
  keyboardEnable?: boolean;
  scrollWheel?: boolean;
  touchZoom?: boolean;
}

export interface AmapMarkerOptions {
  position: [number, number];
  title?: string;
  content?: string;
  icon?: string;
  size?: [number, number];
  offset?: [number, number];
  anchor?: string;
  draggable?: boolean;
  cursor?: string;
  clickable?: boolean;
  extData?: any;
}

export interface AmapInfoWindowOptions {
  content: string;
  size?: [number, number];
  offset?: [number, number];
  position?: [number, number];
  isCustom?: boolean;
  autoMove?: boolean;
  closeWhenClickMap?: boolean;
  showShadow?: boolean;
}

export interface AmapGeocoderOptions {
  city?: string;
  radius?: number;
  extensions?: "base" | "all";
  batch?: boolean;
}

export interface AmapPlaceSearchOptions {
  city?: string;
  citylimit?: boolean;
  children?: number;
  pageSize?: number;
  pageIndex?: number;
  extensions?: "base" | "all";
}
