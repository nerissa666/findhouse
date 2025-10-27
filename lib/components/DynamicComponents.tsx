/**
 * 项目中适合使用 Dynamic Import 的组件示例
 */

import dynamic from "next/dynamic";

// 1. 地图组件 - 只在需要时加载
export const AmapExample = dynamic(() => import("@/components/AmapExample"), {
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse">地图加载中...</div>
  ),
  ssr: false, // 地图组件不需要服务端渲染
});

// 2. 图表组件 - 只在数据页面加载
export const ChartComponent = dynamic(() => import("@/components/Chart"), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse">图表加载中...</div>
  ),
  ssr: false,
});

// 3. 富文本编辑器 - 只在编辑页面加载
export const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor"),
  {
    loading: () => (
      <div className="h-32 bg-gray-100 animate-pulse">编辑器加载中...</div>
    ),
    ssr: false,
  }
);

// 4. 第三方组件库 - 减少初始包大小
export const DatePicker = dynamic(
  () => import("antd-mobile").then((mod) => ({ default: mod.DatePicker })),
  {
    loading: () => (
      <div className="h-10 bg-gray-100 animate-pulse rounded">
        日期选择器加载中...
      </div>
    ),
    ssr: false,
  }
);

// 5. 条件加载的组件
export const ConditionalComponent = dynamic(
  () => import("@/components/ConditionalComponent"),
  {
    loading: () => <div>条件组件加载中...</div>,
    ssr: false,
  }
);

// 6. 大型列表组件 - 虚拟滚动
export const VirtualList = dynamic(() => import("@/components/VirtualList"), {
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse">列表加载中...</div>
  ),
  ssr: false,
});

// 7. 模态框组件 - 按需加载
export const Modal = dynamic(() => import("@/components/Modal"), {
  loading: () => null, // 模态框不需要加载状态
  ssr: false,
});

// 8. 工具组件 - 只在特定功能中使用
export const ImageUploader = dynamic(
  () => import("@/components/ImageUploader"),
  {
    loading: () => (
      <div className="h-32 bg-gray-100 animate-pulse rounded">
        上传组件加载中...
      </div>
    ),
    ssr: false,
  }
);
