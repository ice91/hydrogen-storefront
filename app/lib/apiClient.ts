// app/lib/apiClient.ts

import axios from "axios";

// 使用環境變量設置 baseURL
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL || "https://localhost:5173";

// 創建 Axios 實例
const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // 確保 '/api' 被正確添加
  withCredentials: true, // 確保請求攜帶憑證（Cookie）
});

// 移除請求攔截器
// 因為我們不再使用 Authorization header

// 响应拦截器，可根据需要添加
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 處理響應錯誤，例如未授權
    return Promise.reject(error);
  }
);

export default apiClient;