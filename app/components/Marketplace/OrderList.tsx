// app/components/Marketplace/OrderList.tsx

import React, { useEffect, useState } from 'react';
import apiClient from '~/lib/apiClient';
import OrderCard from './OrderCard';
import { Order } from '~/lib/type';
import { useSellerAuth } from './SellerAuthProvider';

const OrderList: React.FC = () => {
  const { user, loading: authLoading } = useSellerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取卖家的订单列表
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/orders/mine');
      setOrders(response.data.orders);
    } catch (err) {
      console.error('获取订单列表时出错：', err);
      setError('无法获取订单列表。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">我的订单</h2>
      {orders.length === 0 ? (
        <p>您尚未收到任何订单。</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
