// app/lib/apiClient.ts

import axios from 'axios';

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: 'https://canvastalk-867062847423.asia-east1.run.app/api',
});

// 请求拦截器，自动附加 JWT 令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); // 或使用其他安全存储方式
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
