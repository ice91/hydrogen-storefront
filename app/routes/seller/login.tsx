// app/routes/seller/login.tsx

import React, { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import apiClient from '~/lib/apiClient';

export default function SellerLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const initiateLogin = async () => {
      try {
        // 向后端请求生成 OIDC 授权 URL
        const response = await apiClient.get('/auth/seller/login');
        if (response.status === 200) {
          window.location.href = response.data.redirectUrl;
        } else {
          alert('登录请求失败');
        }
      } catch (error: any) {
        console.error('启动登录流程时发生错误:', error);
        alert('启动登录流程时发生错误');
      }
    };

    initiateLogin();
  }, [navigate]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在跳转到登录页面...</p>
      </div>
    </PageLayout>
  );
}
