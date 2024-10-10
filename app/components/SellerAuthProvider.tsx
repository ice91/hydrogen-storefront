// app/components/SellerAuthProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username?: string;
  email?: string;
  name: string;
  roles: string[];
  avatarUrl?: string;
  storefrontUrl?: string;
  earnings?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const SellerAuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 调用后端 API 获取当前用户信息
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
