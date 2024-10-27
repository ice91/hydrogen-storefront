// app/components/Marketplace/SellerAuthProvider.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '~/lib/apiClient';
import { User } from '~/lib/type';

// 定义上下文类型
interface SellerAuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

// 创建上下文
const SellerAuthContext = createContext<SellerAuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

// 创建提供者组件
export const SellerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取卖家信息
  const fetchUser = async () => {
    try {
      const response = await apiClient.get('/auth/seller/user');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      console.error('获取卖家信息时出错：', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

    // 退出登录
  const logout = async () => {
    try {
      await apiClient.post('/auth/seller/logout');
      setUser(null);
      window.location.href = '/seller/login';
    } catch (error) {
      console.error('退出登录时出错：', error);
    }
  };

  return (
    <SellerAuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

// 创建自定义钩子，方便子组件使用
export const useSellerAuth = () => {
  return useContext(SellerAuthContext);
};
