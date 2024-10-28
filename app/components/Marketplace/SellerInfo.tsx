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

  // 获取卖家统计数据
  const fetchSellerStats = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/auth/seller/stats');
      setSellerStats(response.data.stats);
    } catch (err) {
      console.error('获取卖家统计数据时出错：', err);
      setError('无法获取卖家统计数据。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerStats();
  }, [user]);

  if (authLoading || loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">卖家信息</h3>
      <p><strong>姓名：</strong> {user?.name}</p>
      <p><strong>邮箱：</strong> {user?.email}</p>
      <p><strong>总销售额：</strong> ${sellerStats.totalSales.toFixed(2)}</p>
      <p><strong>总订单数：</strong> {sellerStats.totalOrders}</p>
      <p><strong>总产品数：</strong> {sellerStats.totalProducts}</p>
      {/* 可以添加更多统计信息或操作按钮 */}
    </div>
  );
};

export default SellerInfo;
