// app/components/Marketplace/SellerAuthProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '~/lib/apiClient';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  roles: string[];
  avatarUrl?: string;
  storefrontUrl?: string;
  earnings?: number;
  paymentDetails?: any;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const SellerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/auth/seller/user');
        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error: any) {
        console.error('获取用户信息时发生错误:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
