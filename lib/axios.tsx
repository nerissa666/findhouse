// findhouse/axios.tsx
const controller = new AbortController();
import axios, { AxiosResponse } from "axios";
// 扩展 AxiosResponse 类型
interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
  body?: T;
}
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
    // 在发送请求之前做些什么，比如添加认证 token
    // config.headers.Authorization = `Bearer ${your_token}`;
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
  ({ data: { status, body } }) => {
    // 将 data 赋值给 body（仅为了类型兼容，实际上不需要这样做）
    // const customResponse = response as unknown as CustomAxiosResponse<
    //   typeof response.data
    // >;
    // customResponse.body = customResponse.data;
    if (status === 200) {
      console.log("body:", body);
      return body;
    } else {
      return Promise.reject(new Error("Response error"));
    }
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 将封装后的 Axios 实例导出
export default axiosInstance;
