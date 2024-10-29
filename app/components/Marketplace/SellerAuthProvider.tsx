// app/components/Marketplace/SellerAuthProvider.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '~/lib/apiClient';
import { User } from '~/lib/type';

// 定義上下文類型
interface SellerAuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

// 創建上下文
const SellerAuthContext = createContext<SellerAuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

// 創建提供者組件
export const SellerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 獲取賣家信息
  const fetchUser = async () => {
    try {
      const response = await apiClient.get('/auth/seller/user');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      console.error('獲取賣家信息時出錯：', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 退出登錄
  const logout = async () => {
    try {
      await apiClient.post('/auth/seller/logout');
      setUser(null);
      window.location.href = '/seller/login';
    } catch (error) {
      console.error('退出登錄時出錯：', error);
      // 提供用戶友好的錯誤提示
      alert('退出登錄失敗，請稍後再試。');
    }
  };

  return (
    <SellerAuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

// 創建自定義鉤子，方便子組件使用
export const useSellerAuth = () => {
  return useContext(SellerAuthContext);
};
