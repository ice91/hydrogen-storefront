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

  // 獲取賣家的訂單列表
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/orders/mine');
      setOrders(response.data.orders);
    } catch (err) {
      console.error('獲取訂單列表時出錯：', err);
      setError('無法獲取訂單列表。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return <div>加載中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">我的訂單</h2>
      {orders.length === 0 ? (
        <p>您尚未收到任何訂單。</p>
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
