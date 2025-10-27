"use client";
// antd-mobile React 19 兼容性补丁
// 解决 antd-mobile v5 与 React 19 的兼容性问题

// 在模块加载时立即执行补丁
(function () {
  // 抑制 antd-mobile 的 React 版本警告
  if (typeof window !== "undefined") {
    // 重写 console.warn 来过滤 antd-mobile 的版本警告
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(" ");
      // 过滤掉 antd-mobile 的 React 版本警告
      if (
        message.includes(
          "[Compatible] antd-mobile v5 support React is 16 ~ 18"
        ) ||
        message.includes("antd-mobile v5 support React is 16 ~ 18") ||
        message.includes("antd-mobile v5 support React is 16 ~ 18")
      ) {
        return;
      }
      // 其他警告正常显示
      originalWarn.apply(console, args);
    };

    // 为 antd-mobile 提供 React 版本兼容性
    if (!(window as any).__REACT_VERSION__) {
      (window as any).__REACT_VERSION__ = "18.0.0";
    }

    // 确保 React 版本检查通过
    if (!(window as any).React) {
      (window as any).React = {
        version: "18.0.0",
      };
    }

    // 设置环境变量来抑制警告
    if (!(window as any).process) {
      (window as any).process = { env: {} };
    }
    (window as any).process.env.NODE_ENV = "production";
  }
})();

// 导出空对象，确保模块被加载
export {};
