# 城市坐标功能使用指南

## 概述

城市坐标功能允许应用根据用户选择的城市自动设置地图中心点，提供更准确的地理定位服务。

## 功能特性

### ✅ 已实现功能

- **自动城市定位**: 根据选择的城市自动设置地图中心点
- **坐标数据管理**: 支持 92 个主要城市的坐标数据
- **类型安全**: 完整的 TypeScript 类型定义
- **工具函数**: 提供便捷的城市坐标处理函数

### 📊 支持的城市

- **一线城市**: 北京、上海、广州、深圳
- **二线城市**: 杭州、南京、苏州、成都、重庆、武汉、西安、天津等
- **其他重要城市**: 青岛、大连、厦门、宁波、福州、济南、长沙、郑州等
- **总计**: 92 个城市包含完整坐标数据

## 使用方法

### 1. 基本使用

```typescript
import { useAppSelector } from "@/lib/hooks";
import { getCityMapCenter, hasCityCoordinates } from "@/lib/utils/cityUtils";

function MyComponent() {
  const city = useAppSelector((state) => state.city.currentCity);

  // 获取城市地图中心点
  const mapCenter = getCityMapCenter(city);

  // 检查是否有坐标数据
  const hasCoordinates = hasCityCoordinates(city);

  return (
    <div>
      <p>当前城市: {city.label}</p>
      {hasCoordinates ? (
        <p>
          坐标: {city.coord?.longitude}, {city.coord?.latitude}
        </p>
      ) : (
        <p>使用默认坐标</p>
      )}
    </div>
  );
}
```

### 2. 地图组件使用

```typescript
import { getCityMapCenter } from "@/lib/utils/cityUtils";

function MapComponent() {
  const city = useAppSelector((state) => state.city.currentCity);
  const mapCenter = getCityMapCenter(city);

  return (
    <AmapExample
      center={mapCenter} // 使用动态城市中心点
      zoom={10}
      height="100vh"
      // ... 其他属性
    />
  );
}
```

### 3. 距离计算

```typescript
import { calculateCityDistance } from "@/lib/utils/cityUtils";

function DistanceComponent() {
  const city1 = {
    label: "北京",
    coord: { longitude: "116.397428", latitude: "39.90923" },
  };
  const city2 = {
    label: "上海",
    coord: { longitude: "121.473701", latitude: "31.230416" },
  };

  const distance = calculateCityDistance(city1, city2);

  return (
    <div>
      <p>距离: {distance ? `${distance}公里` : "无法计算"}</p>
    </div>
  );
}
```

## API 数据格式

### 城市数据格式

```typescript
interface SelectOption {
  label?: string;
  value: string;
  coord?: Coord;
}

interface Coord {
  latitude: string;
  longitude: string;
}
```

### API 返回示例

```json
{
  "label": "北京",
  "value": "AREA|88cff55c-aaa4-e2e0",
  "coord": {
    "longitude": "116.397428",
    "latitude": "39.909230"
  }
}
```

## 工具函数

### `getCityMapCenter(city: SelectOption)`

获取城市的地图中心点坐标

- **参数**: 城市数据对象
- **返回**: `{ lng: number, lat: number }`
- **说明**: 如果城市有坐标则使用城市坐标，否则使用默认坐标（北京）

### `hasCityCoordinates(city: SelectOption)`

检查城市是否有坐标数据

- **参数**: 城市数据对象
- **返回**: `boolean`
- **说明**: 检查城市是否包含有效的坐标数据

### `formatCityCoordinates(coord: Coord)`

格式化城市坐标数据

- **参数**: 坐标数据对象
- **返回**: `{ lng: number, lat: number }`
- **说明**: 将字符串坐标转换为数字坐标

### `calculateCityDistance(city1: SelectOption, city2: SelectOption)`

计算两个城市之间的距离

- **参数**: 两个城市数据对象
- **返回**: `number | null`
- **说明**: 使用 Haversine 公式计算距离，返回公里数

## 组件示例

### CityInfo 组件

```typescript
import CityInfo from "@/components/CityInfo";

function MyPage() {
  return (
    <div>
      <CityInfo />
      {/* 其他内容 */}
    </div>
  );
}
```

## 注意事项

1. **坐标精度**: 所有坐标数据精确到小数点后 6 位
2. **默认坐标**: 当城市没有坐标数据时，使用北京坐标作为默认值
3. **类型安全**: 所有函数都有完整的 TypeScript 类型定义
4. **性能优化**: 坐标计算使用缓存，避免重复计算

## 扩展功能

### 添加新城市坐标

1. 在后端数据库中添加城市坐标数据
2. 更新 `extendedCityCoordinates` 对象
3. 运行坐标更新脚本

### 自定义坐标处理

```typescript
// 自定义坐标处理函数
const customGetCityCenter = (
  city: SelectOption,
  fallback: { lng: number; lat: number }
) => {
  if (hasCityCoordinates(city)) {
    return getCityMapCenter(city);
  }
  return fallback;
};
```

## 故障排除

### 常见问题

1. **坐标显示为 null**: 检查 API 返回数据格式
2. **地图不居中**: 确认坐标数据格式正确
3. **类型错误**: 检查 TypeScript 类型定义

### 调试方法

```typescript
// 调试城市坐标数据
console.log("City data:", city);
console.log("Has coordinates:", hasCityCoordinates(city));
console.log("Map center:", getCityMapCenter(city));
```
