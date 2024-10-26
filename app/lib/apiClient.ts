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

// 请求拦截器：根据需要添加
apiClient.interceptors.request.use(
  (config) => {
    // 如果后端使用 HttpOnly Cookie 来存储 JWT，则无需在前端手动添加 Authorization 头
    // 否则，可以从 localStorage 或其他存储中获取 JWT 并添加到请求头
    // 例如：
    // const token = localStorage.getItem('jwt');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：根据需要处理错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // 根据状态码进行统一处理
      switch (error.response.status) {
        case 401:
          // 未授权，可能需要重定向到登录页面
          window.location.href = '/seller/login';
          break;
        case 403:
          // 禁止访问，可以显示提示信息
          alert('您无权访问此资源。');
          break;
        case 500:
          // 服务器错误
          alert('服务器发生错误，请稍后再试。');
          break;
        // 可以根据需要添加更多状态码的处理
        default:
          alert(error.response.data.message || '发生错误，请稍后再试。');
      }
    } else if (error.request) {
      // 请求已发出，但未收到响应
      alert('无法连接到服务器，请检查您的网络连接。');
    } else {
      // 其他错误
      alert('发生错误：' + error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
