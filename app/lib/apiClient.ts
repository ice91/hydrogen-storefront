// app/lib/apiClient.ts

import axios, { AxiosError, AxiosResponse } from 'axios';

// 使用环境变量设置 baseURL
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5173';

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // 确保 '/api' 被正确添加
  withCredentials: true, // 确保请求携带凭证（Cookie）
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：可以根据需要添加或删除
apiClient.interceptors.request.use(
  (config) => {
    // 如果后端使用 HttpOnly Cookie 来存储 JWT，则无需在前端手动添加 Authorization 头
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：根据需要进行错误处理
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = '/seller/login';
          break;
        case 403:
          alert('您无权访问此资源。');
          break;
        case 500:
          alert('服务器发生错误，请稍后再试。');
          break;
        default:
          alert(error.response.data.message || '发生错误，请稍后再试。');
      }
    } else if (error.request) {
      alert('无法连接到服务器，请检查您的网络连接。');
    } else {
      alert('发生错误：' + error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
