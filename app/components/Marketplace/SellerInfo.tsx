// app/components/Marketplace/SellerInfo.tsx

import React from 'react';
import { useAuth } from './SellerAuthProvider';

export const SellerInfo: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>加载中...</p>;
  }

  if (!user) {
    return <p>未登录为卖家。</p>;
  }

  return (
    <div className="seller-info p-4 bg-gray-100 rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-2">卖家信息</h2>
      <p><strong>姓名：</strong> {user.name}</p>
      <p><strong>邮箱：</strong> {user.email}</p>
      {user.storefrontUrl && (
        <p>
          <strong>店铺链接：</strong> 
          <a href={user.storefrontUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {user.storefrontUrl}
          </a>
        </p>
      )}
      {typeof user.earnings === 'number' && (
        <p><strong>收益：</strong> ${user.earnings.toFixed(2)}</p>
      )}
      {/* 根据需要添加更多卖家信息 */}
    </div>
  );
};