import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    avatar?: string;
  } | null;
  tokenExpiry: number | null; // 添加 token 过期时间
}

// 检查 token 是否过期的辅助函数
const isTokenExpired = (expiry: number | null): boolean => {
  if (!expiry) return true;
  return Date.now() > expiry;
};

// 获取初始状态
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      token: null,
      isAuthenticated: false,
      user: null,
      tokenExpiry: null,
    };
  }

  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const user = localStorage.getItem("user");

  // 检查 token 是否过期
  const expiry = tokenExpiry ? parseInt(tokenExpiry) : null;
  const expired = isTokenExpired(expiry);

  if (expired && token) {
    // 清除过期的 token
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
  }

  return {
    token: expired ? null : token,
    isAuthenticated: !expired && !!token,
    user: user ? JSON.parse(user) : null,
    tokenExpiry: expiry,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      // 设置七天过期时间
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7天
      state.tokenExpiry = expiry;

      // 存储到localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
        localStorage.setItem("tokenExpiry", expiry.toString());
      }
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;

      // 存储用户信息到localStorage
      if (typeof window !== "undefined" && action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.tokenExpiry = null;

      // 清除localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("user");
      }
    },
    initializeAuth: (state) => {
      // 初始化时检查localStorage中的token
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        const user = localStorage.getItem("user");

        if (token && tokenExpiry) {
          const expiry = parseInt(tokenExpiry);
          const expired = isTokenExpired(expiry);

          if (!expired) {
            state.token = token;
            state.isAuthenticated = true;
            state.tokenExpiry = expiry;
            state.user = user ? JSON.parse(user) : null;
          } else {
            // 清除过期的数据
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("user");
          }
        }
      }
    },
  },
});

export const { setToken, setUser, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
