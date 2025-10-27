// Token管理工具函数

/**
 * 获取存储的token
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/**
 * 设置token到localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

/**
 * 移除token
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * 从localStorage获取用户信息
 */
export const getUserInfo = (): any => {
  if (typeof window === "undefined") return null;
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 设置用户信息到localStorage
 */
export const setUserInfo = (userInfo: any): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

/**
 * 清除用户信息
 */
export const clearUserInfo = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userInfo");
};

/**
 * 登出 - 清除所有认证信息
 */
export const logout = (): void => {
  removeToken();
  clearUserInfo();
};
