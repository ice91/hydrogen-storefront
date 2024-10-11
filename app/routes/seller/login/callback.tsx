// app/routes/seller/login/callback.tsx

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import apiClient from '~/lib/apiClient';
import { useAuth } from '~/components/Marketplace/SellerAuthProvider';

export default function SellerLoginCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code && state) {
        try {
          // 向后端发送授权码以交换 JWT 令牌
          const response = await apiClient.post('/auth/seller/callback', { code, state });
          if (response.status === 200) {
            const token = response.data.token;
            if (token) {
              localStorage.setItem('jwt', token);
              // 获取卖家用户信息
              const userRes = await apiClient.get('/auth/seller/user');
              if (userRes.status === 200) {
                setUser(userRes.data.user);
                navigate('/marketplace');
              }
            } else {
              alert('登录失败：未收到令牌');
              navigate('/');
            }
          } else {
            const errorData = response.data;
            alert(`登录失败：${errorData.error}`);
            navigate('/');
          }
        } catch (error: any) {
          console.error('处理认证回调时发生错误:', error);
          alert('处理认证回调时发生错误');
          navigate('/');
        }
      } else {
        alert('缺少认证参数');
        navigate('/');
      }
    };

    handleCallback();
  }, [location.search, navigate, setUser]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在处理登录...</p>
      </div>
    </PageLayout>
  );
}
