// app/routes/($locale).auth.callback.tsx

import React, { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 认证完成后，重定向到卖家仪表盘
    navigate('/seller/dashboard');
  }, [navigate]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在认证，稍候...</p>
      </div>
    </PageLayout>
  );
};

export default AuthCallback;

