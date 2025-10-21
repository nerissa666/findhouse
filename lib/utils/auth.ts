// 认证相关的工具函数

/**
 * 检查 token 是否过期
 * @param expiry 过期时间戳
 * @returns 是否过期
 */
export const isTokenExpired = (expiry: number | null): boolean => {
  if (!expiry) return true;
  return Date.now() > expiry;
};

/**
 * 获取 token 剩余时间（毫秒）
 * @param expiry 过期时间戳
 * @returns 剩余时间（毫秒），如果已过期返回 0
 */
export const getTokenRemainingTime = (expiry: number | null): number => {
  if (!expiry) return 0;
  const remaining = expiry - Date.now();
  return remaining > 0 ? remaining : 0;
};

/**
 * 格式化剩余时间为可读格式
 * @param expiry 过期时间戳
 * @returns 格式化的剩余时间字符串
 */
export const formatTokenRemainingTime = (expiry: number | null): string => {
  const remaining = getTokenRemainingTime(expiry);
  if (remaining === 0) return "已过期";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}天${hours}小时`;
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else {
    return `${minutes}分钟`;
  }
};

/**
 * 检查是否在客户端环境
 * @returns 是否在客户端
 */
export const isClient = (): boolean => {
  return typeof window !== "undefined";
};

/**
 * 安全地获取 localStorage 中的值
 * @param key 键名
 * @returns 值或 null
 */
export const getLocalStorageItem = (key: string): string | null => {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("获取 localStorage 失败:", error);
    return null;
  }
};

/**
 * 安全地设置 localStorage 中的值
 * @param key 键名
 * @param value 值
 */
export const setLocalStorageItem = (key: string, value: string): void => {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("设置 localStorage 失败:", error);
  }
};

/**
 * 安全地删除 localStorage 中的值
 * @param key 键名
 */
export const removeLocalStorageItem = (key: string): void => {
  if (!isClient()) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("删除 localStorage 失败:", error);
  }
};
