/**
 * Swiper 工具函数 - 处理轮播图相关逻辑
 */

import { ReactNode } from "react";

/**
 * 创建轮播图项目
 * @param items 数据数组
 * @param renderItem 渲染函数
 * @param fallback 占位符
 * @returns 轮播图项目数组
 */
export const createSwiperItems = <T,>(
  items: T[],
  renderItem: (item: T, index: number) => ReactNode,
  fallback?: ReactNode
): ReactNode[] => {
  if (!items || items.length === 0) {
    return fallback ? [fallback] : [];
  }

  return items.map(renderItem);
};

/**
 * 检查轮播图是否需要循环
 * @param items 项目数组
 * @param minItems 最小项目数，默认为 2
 * @returns 是否需要循环
 */
export const shouldLoop = (items: any[], minItems: number = 2): boolean => {
  return items.length >= minItems;
};

/**
 * 检查轮播图是否需要自动播放
 * @param items 项目数组
 * @param minItems 最小项目数，默认为 2
 * @returns 是否需要自动播放
 */
export const shouldAutoplay = (items: any[], minItems: number = 2): boolean => {
  return items.length >= minItems;
};

/**
 * 创建默认占位符
 * @param message 占位符消息
 * @param className 样式类名
 * @returns 占位符元素
 */
export const createDefaultFallback = (
  message: string = "暂无内容",
  className: string = "flex items-center justify-center h-48 bg-gray-100 text-gray-500"
): ReactNode => {
  return <div className={className}>{message}</div>;
};

/**
 * 处理轮播图配置
 * @param items 项目数组
 * @param config 配置选项
 * @returns 轮播图配置
 */
export const getSwiperConfig = (
  items: any[],
  config: {
    minItems?: number;
    defaultLoop?: boolean;
    defaultAutoplay?: boolean;
  } = {}
) => {
  const { minItems = 2, defaultLoop = false, defaultAutoplay = false } = config;

  return {
    loop: items.length >= minItems ? defaultLoop : false,
    autoplay: items.length >= minItems ? defaultAutoplay : false,
    hasItems: items.length > 0,
  };
};
