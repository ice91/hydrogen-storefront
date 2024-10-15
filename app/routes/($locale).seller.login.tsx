// app/routes/($locale).seller.login.tsx

import React, { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import apiClient from '~/lib/apiClient';

export default function SellerLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const initiateLogin = async () => {
      try {
        const response = await apiClient.get('/auth/seller/login');

        if (response.status === 302 || response.request.responseURL) {
          // 后端返回重定向 URL
          window.location.href = response.request.responseURL;
        } else {
          alert('登錄請求失敗');
        }
      } catch (error: any) {
        console.error('啟動登入流程時發生錯誤:', error);
        alert('啟動登入流程時發生錯誤');
      }
    };

    initiateLogin();
  }, [navigate]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在跳到登入頁面...</p>
      </div>
    </PageLayout>
  );
}
