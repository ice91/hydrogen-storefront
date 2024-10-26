// app/routes/($locale).auth.callback.tsx

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 存储令牌（建议存储在内存中，避免 XSS 风险）
      sessionStorage.setItem('jwtToken', token);
      navigate('/seller/dashboard');
    } else {
      // 处理错误情况
      alert('认证失败，请重试。');
      navigate('/seller/login');
    }
  }, [navigate, location]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在认证，请稍候...</p>
      </div>
    </PageLayout>
  );
};

export default AuthCallback;
