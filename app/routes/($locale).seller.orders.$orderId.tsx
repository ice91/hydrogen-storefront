// app/routes/($locale).seller.orders.$orderId.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import apiClient from '~/lib/apiClient';
import { Order } from '~/lib/type';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider';
import { Navigate } from '@remix-run/react';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams();
  const { user, loading: authLoading } = useSellerAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('订单 ID 无效。');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        console.error('获取订单详情时出错：', err);
        setError('无法获取订单详情。');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p>加载中...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user || !user.roles.includes('seller')) {
    return <Navigate to="/seller/login" replace />;
  }

  if (error || !order) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error || '订单不存在。'}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">订单详情</h2>
        <div className="border rounded-lg p-4">
          <p><strong>订单 ID:</strong> {order.shopifyOrderId}</p>
          <p><strong>总金额:</strong> ${order.totalAmount.toFixed(2)} {order.currency}</p>
          <p><strong>状态:</strong> {order.fulfillmentStatus}</p>
          <p><strong>创建时间:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          {/* 显示订单项详情 */}
          <h3 className="text-xl font-semibold mt-4">订单项</h3>
          <ul className="list-disc list-inside">
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.quantity} × {item.price.toFixed(2)} {order.currency} - 产品 ID: {item.productId}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderDetail;
