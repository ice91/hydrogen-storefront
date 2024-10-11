// app/routes/marketplace/orders.tsx

import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import { OrderList } from '~/components/Marketplace/OrderList';
import apiClient from '~/lib/apiClient';

export async function loader() {
  // 使用 apiClient 获取卖家的订单数据
  const ordersRes = await apiClient.get('/marketplace/orders');
  const ordersData = ordersRes.data;

  return { orders: ordersData.data };
}

export default function OrdersPage() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">订单管理</h1>
        <OrderList orders={orders} />
      </div>
    </PageLayout>
  );
}
