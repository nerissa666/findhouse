# 定位功能使用指南

## 概述

本项目已集成完整的定位功能，支持获取用户当前位置、地址解析、权限管理等。

## 功能特性

### ✅ 已实现功能

- **获取当前位置**: 支持高精度定位
- **地址解析**: 自动获取详细地址信息
- **权限管理**: 智能处理定位权限
- **错误处理**: 完善的错误提示和处理
- **React Hook**: 便捷的定位状态管理
- **UI 组件**: 开箱即用的定位按钮

## 使用方法

### 1. 基础工具函数

```typescript
import {
  getCurrentLocation,
  getCurrentLocationWithAddress,
  isLocationSupported,
  checkLocationPermission,
} from "@/lib/utils/locationUtils";

// 检查浏览器支持
if (isLocationSupported()) {
  // 获取当前位置
  const location = await getCurrentLocation();
  console.log(location.lng, location.lat);

  // 获取位置和地址
  const locationWithAddress = await getCurrentLocationWithAddress();
  console.log(locationWithAddress.address);
}
```

### 2. React Hook 使用

```typescript
import { useLocation } from "@/lib/hooks/useLocation";

function MyComponent() {
  const {
    location,
    error,
    loading,
    supported,
    permission,
    getLocation,
    clearLocation,
    startWatching,
    stopWatching,
    isWatching,
  } = useLocation({
    withAddress: true,
    enableHighAccuracy: true,
    timeout: 10000,
  });

  return (
    <div>
      {loading && <p>定位中...</p>}
      {error && <p>定位失败: {error.message}</p>}
      {location && (
        <p>
          位置: {location.lng}, {location.lat}
          {location.address && <br />}
          {location.address}
        </p>
      )}
      <button onClick={getLocation}>获取定位</button>
    </div>
  );
}
```

### 3. 定位按钮组件

```typescript
import LocationButton from "@/components/LocationButton";

function MapPage() {
  const handleLocationChange = (location) => {
    console.log("定位成功:", location);
    // 处理定位结果
  };

  return (
    <div>
      <LocationButton
        onLocationChange={handleLocationChange}
        withAddress={true}
        showAddress={true}
        size="middle"
        type="primary"
      />
    </div>
  );
}
```

### 4. 地图集成

```typescript
// 在地图页面中使用
import LocationButton from "@/components/LocationButton";
import { useLocation } from "@/lib/hooks/useLocation";

function AmapPage() {
  const { location } = useLocation({ withAddress: true });

  return (
    <div>
      {/* 定位按钮 */}
      <LocationButton
        onLocationChange={(loc) => {
          // 更新地图中心点
          setMapCenter({ lng: loc.lng, lat: loc.lat });
        }}
      />

      {/* 地图组件 */}
      <AmapExample
        center={
          location ? { lng: location.lng, lat: location.lat } : defaultCenter
        }
        zoom={location ? 15 : 10}
      />
    </div>
  );
}
```

## API 参考

### LocationUtils

#### `getCurrentLocation(options?)`

获取用户当前位置

**参数:**

- `options.enableHighAccuracy`: 是否启用高精度定位 (默认: true)
- `options.timeout`: 超时时间，毫秒 (默认: 10000)
- `options.maximumAge`: 缓存时间，毫秒 (默认: 300000)

**返回:** `Promise<LocationData>`

#### `getCurrentLocationWithAddress(options?)`

获取位置和地址信息

**参数:** 同 `getCurrentLocation`

**返回:** `Promise<LocationData>` (包含 address 字段)

#### `watchLocation(callback, options?)`

监听位置变化

**参数:**

- `callback`: 位置变化回调函数
- `options`: 定位选项

**返回:** 清除监听的函数

### UseLocation Hook

#### 参数

```typescript
interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
  withAddress?: boolean;
}
```

#### 返回值

```typescript
interface UseLocationReturn {
  location: LocationData | null; // 当前位置
  error: LocationError | null; // 错误信息
  loading: boolean; // 是否正在加载
  supported: boolean; // 浏览器是否支持定位
  permission: string; // 权限状态
  getLocation: () => Promise<void>; // 获取定位
  clearLocation: () => void; // 清除定位
  startWatching: () => void; // 开始监听
  stopWatching: () => void; // 停止监听
  isWatching: boolean; // 是否正在监听
}
```

### LocationButton 组件

#### 属性

```typescript
interface LocationButtonProps {
  onLocationChange?: (location: LocationData) => void;
  withAddress?: boolean; // 是否获取地址
  showAddress?: boolean; // 是否显示地址
  className?: string; // 自定义样式
  size?: "small" | "middle" | "large"; // 按钮大小
  type?: "primary" | "default" | "dashed" | "link" | "text";
}
```

## 错误处理

### 常见错误码

- `1`: 用户拒绝了定位请求
- `2`: 定位信息不可用
- `3`: 定位请求超时
- `-1`: 浏览器不支持定位

### 权限状态

- `granted`: 已授权
- `denied`: 已拒绝
- `prompt`: 需要用户授权
- `unknown`: 未知状态

## 最佳实践

### 1. 权限处理

```typescript
const { permission, supported } = useLocation();

if (!supported) {
  return <div>您的浏览器不支持定位功能</div>;
}

if (permission === "denied") {
  return <div>请在浏览器设置中允许定位权限</div>;
}
```

### 2. 错误处理

```typescript
const { error, getLocation } = useLocation();

const handleGetLocation = async () => {
  try {
    await getLocation();
  } catch (err) {
    // 处理定位错误
    console.error("定位失败:", err);
  }
};
```

### 3. 性能优化

```typescript
// 使用缓存，避免频繁定位
const { getLocation } = useLocation({
  maximumAge: 300000, // 5分钟缓存
  timeout: 10000, // 10秒超时
});
```

## 注意事项

1. **HTTPS 要求**: 定位功能需要 HTTPS 环境
2. **用户授权**: 首次使用需要用户授权
3. **精度设置**: 高精度定位可能消耗更多电量
4. **超时处理**: 设置合理的超时时间
5. **错误提示**: 提供友好的错误提示信息

## 环境变量

确保在 `.env.local` 中配置高德地图 API 密钥：

```env
NEXT_PUBLIC_AMAP_KEY=your_amap_api_key
```

## 示例项目

查看 `app/(home)/amap/page.tsx` 了解完整的地图定位集成示例。
