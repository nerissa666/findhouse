/**
 * Dynamic Import 工具函数
 */

import dynamic from "next/dynamic";

// 1. 基础 Dynamic Import
export const createDynamicComponent = <T = any>(
  importPath: string,
  componentName?: string
) => {
  return dynamic(() =>
    import(importPath).then((mod) =>
      componentName ? mod[componentName] : mod.default
    )
  );
};

// 2. 带加载状态的 Dynamic Import
export const createDynamicComponentWithLoading = <T = any>(
  importPath: string,
  componentName?: string,
  loadingComponent?: React.ComponentType
) => {
  return dynamic(
    () =>
      import(importPath).then((mod) =>
        componentName ? mod[componentName] : mod.default
      ),
    {
      loading: loadingComponent ? () => <loadingComponent /> : undefined,
      ssr: false, // 禁用服务端渲染
    }
  );
};

// 3. 条件加载的 Dynamic Import
export const createConditionalDynamicComponent = <T = any>(
  importPath: string,
  shouldLoad: boolean,
  fallback?: React.ComponentType
) => {
  if (!shouldLoad && fallback) {
    return fallback;
  }

  return dynamic(() => import(importPath), {
    ssr: false,
  });
};

// 4. 预加载的 Dynamic Import
export const createPreloadableComponent = <T = any>(
  importPath: string,
  componentName?: string
) => {
  const Component = dynamic(() =>
    import(importPath).then((mod) =>
      componentName ? mod[componentName] : mod.default
    )
  );

  // 预加载函数
  const preload = () => import(importPath);

  return { Component, preload };
};

// 5. 错误边界的 Dynamic Import
export const createDynamicComponentWithErrorBoundary = <T = any>(
  importPath: string,
  componentName?: string,
  errorFallback?: React.ComponentType<{ error: Error }>
) => {
  return dynamic(
    () =>
      import(importPath).then((mod) =>
        componentName ? mod[componentName] : mod.default
      ),
    {
      ssr: false,
      loading: () => <div>加载中...</div>,
      // 可以结合 ErrorBoundary 使用
    }
  );
};
