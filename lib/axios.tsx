// findhouse/axios.tsx
const controller = new AbortController();
import axios from "axios";
// 扩展 AxiosResponse 类型（暂时注释掉，未使用）
// interface CustomAxiosResponse<T = unknown> extends AxiosResponse<T> {
//   body?: T;
// }
const axiosInstance = axios.create({
  //   baseURL: process.env.REACT_APP_URL, // 你的 API 基础 URL
  baseURL: "http://localhost:8080", // 你的 API 基础 URL
  timeout: 10000, // 请求超时时间（毫秒）
});

// 用signal来取消请求
// const signal = AbortSignal.timeout(10000);

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("config:", config);
    // 在发送请求之前做些什么，比如添加认证 token
    // 直接从localStorage获取token，避免在拦截器中使用React Hooks
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      console.log("token:", token);
      // config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log("errorXxx", error);
    controller.abort();
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response:", response);
    const { data } = response;

    // 检查响应数据结构
    if (data && typeof data === "object") {
      // 如果数据有 status 和 body 字段
      if ("status" in data && "body" in data) {
        if (data.status === 200) {
          console.log("body:", data.body);
          return data.body;
        } else {
          return Promise.reject(new Error(`API Error: ${data.status}`));
        }
      }
      // 如果数据直接是结果，没有包装
      return data;
    }

    // 如果数据结构不符合预期，返回原始数据
    return data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response?.status === 401) {
      // token过期或无效，清除本地存储的token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        // 可以跳转到登录页面
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 将封装后的 Axios 实例导出
export default axiosInstance;
