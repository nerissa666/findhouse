"use client";
// React 19 兼容性补丁
// 解决 unmountComponentAtNode 在 React 19 中被移除的问题

import { createRoot } from "react-dom/client";

// 全局补丁，确保在任何库使用之前就设置好
if (typeof window !== "undefined") {
  // 创建全局 ReactDOM 对象
  (window as any).ReactDOM = (window as any).ReactDOM || {};

  // 添加 unmountComponentAtNode 方法
  (window as any).ReactDOM.unmountComponentAtNode = (
    container: Element | DocumentFragment
  ) => {
    try {
      // 检查容器是否已经被 React 19 的 createRoot 管理
      if ((container as any)._reactRootContainer) {
        const root = (container as any)._reactRootContainer;
        root.unmount();
        return true;
      }

      // 如果没有，尝试创建新的 root 并卸载
      const root = createRoot(container);
      root.unmount();
      return true;
    } catch (error) {
      console.warn("Failed to unmount component:", error);
      // 作为后备方案，清空容器内容
      try {
        container.innerHTML = "";
        return true;
      } catch (fallbackError) {
        console.warn("Fallback unmount also failed:", fallbackError);
        return false;
      }
    }
  };

  // 添加 render 方法
  (window as any).ReactDOM.render = (
    element: React.ReactElement,
    container: Element | DocumentFragment
  ) => {
    const root = createRoot(container);
    root.render(element);
    return root;
  };
}
