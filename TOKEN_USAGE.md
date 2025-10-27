# 用户 Token 携带使用指南

## 概述

本项目已经实现了自动 token 携带功能，所有通过 axios 发送的请求都会自动在请求头中携带用户的认证 token。

## 实现方案

### 1. 自动 Token 携带

在 `lib/axios.tsx` 中的请求拦截器会自动从 localStorage 获取 token 并添加到请求头：

```typescript
// 请求拦截器自动添加token
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
  // ...
);
```

### 2. Token 管理

#### 存储 Token

```typescript
import { setToken } from "@/lib/auth";

// 登录成功后存储token
setToken("your-jwt-token-here");
```

#### 获取 Token

```typescript
import { getToken } from "@/lib/auth";

const token = getToken();
```

#### 清除 Token

```typescript
import { removeToken, logout } from "@/lib/auth";

// 只清除token
removeToken();

// 清除所有认证信息（推荐）
logout();
```

### 3. Redux 状态管理

使用 Redux 管理认证状态：

```typescript
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser, logout } from "@/lib/stores/slices/authSlice";

// 在组件中使用
const dispatch = useDispatch();
const { token, isAuthenticated, user } = useSelector(
  (state: RootState) => state.auth
);

// 设置token
dispatch(setToken("your-token"));

// 设置用户信息
dispatch(setUser({ id: "1", username: "user" }));

// 登出
dispatch(logout());
```

### 4. 使用示例

#### 登录组件

```typescript
// components/LoginForm.tsx
const onFinish = async (values: LoginFormData) => {
  try {
    const response = await axios.post("/user/login", values);

    if (response.token) {
      // 存储token（会自动携带到后续请求）
      setToken(response.token);
      dispatch(setToken(response.token));

      // 存储用户信息
      if (response.user) {
        setUserInfo(response.user);
        dispatch(setUser(response.user));
      }
    }
  } catch (error) {
    console.error("登录失败:", error);
  }
};
```

#### 需要认证的 API 调用

```typescript
// 任何需要认证的请求都会自动携带token
const submitHouse = async (formData: any) => {
  try {
    // token会自动通过axios拦截器携带
    const response = await axios.post("/user/houses", formData);
    console.log("提交成功", response);
  } catch (error) {
    if (error.response?.status === 401) {
      // token过期，需要重新登录
      console.log("用户未登录或token已过期");
    }
  }
};
```

### 5. 错误处理

响应拦截器会自动处理 401 错误（token 过期）：

```typescript
// 响应拦截器自动处理token过期
axiosInstance.interceptors.response.use(
  // 成功响应处理
  ({ data: { status, body } }) => {
    if (status === 200) {
      return body;
    } else {
      return Promise.reject(new Error("Response error"));
    }
  },
  // 错误响应处理
  (error) => {
    if (error.response?.status === 401) {
      // 自动清除过期的token
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      // 可以跳转到登录页面
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 注意事项

1. **SSR 兼容性**: 所有 localStorage 操作都包含了`typeof window !== 'undefined'`检查，确保在服务端渲染时不会出错。

2. **Token 格式**: 默认使用 Bearer token 格式，格式为`Bearer ${token}`。

3. **自动清理**: 当收到 401 响应时，会自动清除本地存储的 token 和用户信息。

4. **状态同步**: 建议同时使用 Redux 状态和 localStorage，确保状态同步。

## 文件结构

```
lib/
├── axios.tsx          # axios配置，包含请求/响应拦截器
├── auth.ts            # token管理工具函数
└── stores/
    └── slices/
        └── authSlice.ts  # 认证状态管理

components/
└── LoginForm.tsx      # 登录组件示例
```

现在你的所有 axios 请求都会自动携带用户 token，无需在每个请求中手动添加！
