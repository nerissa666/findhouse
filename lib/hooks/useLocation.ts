"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getCurrentLocation,
  getCurrentLocationWithAddress,
  watchLocation,
  isLocationSupported,
  checkLocationPermission,
  LocationData,
  LocationError,
} from "@/lib/utils/locationUtils";

export interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
  withAddress?: boolean;
}

export interface UseLocationReturn {
  location: LocationData | null;
  error: LocationError | null;
  loading: boolean;
  supported: boolean;
  permission: "granted" | "denied" | "prompt" | "unknown";
  getLocation: () => Promise<void>;
  clearLocation: () => void;
  startWatching: () => void;
  stopWatching: () => void;
  isWatching: boolean;
}

/**
 * 获取用户定位的React Hook
 * @param options 定位选项
 * @returns 定位相关的状态和方法
 */

export const useLocation = (
  options: UseLocationOptions = {}
): UseLocationReturn => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000,
    watch = false,
    withAddress = false,
  } = options;

  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");
  const [isWatching, setIsWatching] = useState(false);
  const [watchCleanup, setWatchCleanup] = useState<(() => void) | null>(null);

  // 检查浏览器支持
  useEffect(() => {
    setSupported(isLocationSupported());
  }, []);

  // 检查权限状态
  useEffect(() => {
    const checkPermission = async () => {
      const perm = await checkLocationPermission();
      setPermission(perm);
    };
    checkPermission();
  }, []);

  // 获取定位
  const getLocation = useCallback(async () => {
    if (!supported) {
      setError({
        code: -1,
        message: "您的浏览器不支持定位功能",
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const locationData = withAddress
        ? await getCurrentLocationWithAddress({
            enableHighAccuracy,
            timeout,
            maximumAge,
          })
        : await getCurrentLocation({
            enableHighAccuracy,
            timeout,
            maximumAge,
          });
      setLocation(locationData);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [supported, withAddress, enableHighAccuracy, timeout, maximumAge]);

  // 清除定位
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  // 开始监听位置
  const startWatching = useCallback(() => {
    if (!supported || isWatching) return;

    setLoading(true);
    setError(null);

    try {
      const cleanup = watchLocation(
        (locationData) => {
          setLocation(locationData);
          setLoading(false);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );

      setWatchCleanup(() => cleanup);
      setIsWatching(true);
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  }, [supported, isWatching, enableHighAccuracy, timeout, maximumAge]);

  // 停止监听位置
  const stopWatching = useCallback(() => {
    if (watchCleanup) {
      watchCleanup();
      setWatchCleanup(null);
    }
    setIsWatching(false);
  }, [watchCleanup]);

  // 自动开始监听
  useEffect(() => {
    if (watch && supported && !isWatching) {
      startWatching();
    }

    return () => {
      if (watchCleanup) {
        watchCleanup();
      }
    };
  }, [watch, supported, isWatching, startWatching, watchCleanup]);

  return {
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
  };
};
