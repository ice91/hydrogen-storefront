// app/components/Marketplace/SellerInfo.tsx

import React, { useEffect, useState } from 'react';
import apiClient from '~/lib/apiClient';
import { User } from '~/lib/type';
import { useSellerAuth } from './SellerAuthProvider';

const SellerInfo: React.FC = () => {
  const { user, loading: authLoading } = useSellerAuth();
  const [sellerStats, setSellerStats] = useState<{
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
  }>({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 獲取賣家統計數據
  const fetchSellerStats = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/auth/seller/stats');
      setSellerStats(response.data.stats);
    } catch (err) {
      console.error('獲取賣家統計數據時出錯：', err);
      setError('無法獲取賣家統計數據。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerStats();
  }, [user]);

  if (authLoading || loading) {
    return <div>加載中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">賣家資訊</h3>
      <p><strong>姓名：</strong> {user?.name}</p>
      <p><strong>電子郵件：</strong> {user?.email}</p>
      <p><strong>總銷售額：</strong> ${sellerStats.totalSales.toFixed(2)}</p>
      <p><strong>總訂單數：</strong> {sellerStats.totalOrders}</p>
      <p><strong>總產品數：</strong> {sellerStats.totalProducts}</p>
      {/* 可以添加更多統計資訊或操作按鈕 */}
    </div>
  );
};

export default SellerInfo;
