/**
 * 项目中的优化导入配置
 */

import dynamic from "next/dynamic";

// 1. 地图相关组件 - 按需加载
export const AmapExample = dynamic(() => import("@/components/AmapExample"), {
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-500">地图加载中...</div>
    </div>
  ),
  ssr: false,
});

// 2. 房源列表 - 虚拟滚动，按需加载
export const HouseList = dynamic(() => import("@/components/HouseList"), {
  loading: () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
      ))}
    </div>
  ),
  ssr: false,
});

// 3. 搜索组件 - 非首屏关键组件
export const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
  ssr: false,
});

// 4. 菜单组件 - 已经在使用，进一步优化
export const Menu = dynamic(() => import("../menu").then((mod) => mod.Menu), {
  loading: () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21b97a]"></div>
    </div>
  ),
  ssr: false,
});

// 5. 用户相关组件 - 按需加载
export const UserProfile = dynamic(() => import("@/components/UserProfile"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded"></div>,
  ssr: false,
});

// 6. 图片上传组件 - 只在需要时加载
export const ImageUploader = dynamic(
  () => import("@/components/ImageUploader"),
  {
    loading: () => (
      <div className="h-32 bg-gray-100 animate-pulse rounded border-2 border-dashed border-gray-300"></div>
    ),
    ssr: false,
  }
);

// 7. 条件加载的组件
export const createConditionalComponent = (
  importPath: string,
  condition: boolean
) => {
  if (!condition) return null;

  return dynamic(() => import(importPath), {
    loading: () => (
      <div className="animate-pulse bg-gray-100 rounded h-8"></div>
    ),
    ssr: false,
  });
};

// 8. 预加载关键组件
export const preloadComponents = () => {
  // 预加载关键组件
  import("@/components/SearchBar");
  import("@/components/HouseList");
};
