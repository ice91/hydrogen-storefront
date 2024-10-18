// app/lib/apiClient.ts

import axios from "axios";

// 使用环境变量设置 baseURL
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5173";

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // 确保 '/api' 被正确添加
  // 不使用 withCredentials，因为我们使用 Authorization header
});

// 请求拦截器，自动附加 JWT 令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // 从 localStorage 获取 JWT
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器，可根据需要添加
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理响应错误，例如未授权
    return Promise.reject(error);
  }
);

export default apiClient;