// app/routes/($locale).seller.login.tsx

import React, { useEffect } from 'react';
import { PageLayout } from '~/components/PageLayout';

export default function SellerLogin() {
  useEffect(() => {
    // 使用环境变量构建后端登录 URL
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5173';
    window.location.href = `${backendBaseUrl}/api/auth/seller/login`;
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在重定向到登录页面...</p>
      </div>
    </PageLayout>
  );
}
