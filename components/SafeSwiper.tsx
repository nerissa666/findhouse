/**
 * 安全的 Swiper 组件包装器 - 处理空子元素问题
 */

import { Swiper, SwiperProps } from "antd-mobile";
import { ReactNode } from "react";

interface SafeSwiperProps extends Omit<SwiperProps, "children"> {
  children: ReactNode[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

export const SafeSwiper: React.FC<SafeSwiperProps> = ({
  children,
  fallback,
  showFallback = true,
  loop,
  autoplay,
  ...props
}) => {
  // 过滤掉无效的子元素
  const validChildren = children.filter(Boolean);

  // 如果没有有效子元素，显示占位符
  const displayChildren =
    validChildren.length > 0
      ? validChildren
      : showFallback
      ? [
          fallback || (
            <Swiper.Item key="placeholder">
              <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-500">
                暂无内容
              </div>
            </Swiper.Item>
          ),
        ]
      : [];

  // 如果仍然没有子元素，不渲染 Swiper
  if (displayChildren.length === 0) {
    return null;
  }

  return (
    <Swiper
      {...props}
      loop={loop !== undefined ? loop : displayChildren.length > 1}
      autoplay={autoplay !== undefined ? autoplay : displayChildren.length > 1}
    >
      {displayChildren}
    </Swiper>
  );
};

// 导出默认组件
export default SafeSwiper;
