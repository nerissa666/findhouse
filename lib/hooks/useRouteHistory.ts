import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RouteHistory {
  current: string;
  previous: string | null;
  history: string[];
}

export const useRouteHistory = () => {
  const router = useRouter();
  const [routeHistory, setRouteHistory] = useState<RouteHistory>({
    current: "",
    previous: null,
    history: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;

      setRouteHistory((prev) => {
        const newHistory = [...prev.history];

        // 如果当前路径不在历史记录中，添加它
        if (!newHistory.includes(currentPath)) {
          newHistory.push(currentPath);
        }

        return {
          current: currentPath,
          previous: prev.current !== currentPath ? prev.current : prev.previous,
          history: newHistory.slice(-10), // 只保留最近10个路由
        };
      });
    }
  }, []);

  const goBack = () => {
    if (routeHistory.previous) {
      router.push(routeHistory.previous);
    } else {
      router.back();
    }
  };

  const navigateWithHistory = (path: string) => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`${path}?from=${encodeURIComponent(currentPath)}`);
    }
  };

  return {
    currentRoute: routeHistory.current,
    previousRoute: routeHistory.previous,
    routeHistory: routeHistory.history,
    goBack,
    navigateWithHistory,
  };
};
