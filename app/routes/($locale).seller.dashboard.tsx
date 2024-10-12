// app/routes/($locale).seller.dashboard.tsx

import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import { SellerInfo } from '~/components/Marketplace/SellerInfo';
import { ProductList } from '~/components/Marketplace/ProductList';
import { OrderList } from '~/components/Marketplace/OrderList';
import apiClient from '~/lib/apiClient';
import { useAuth } from '~/components/Marketplace/SellerAuthProvider';

export async function loader() {
  // 使用 apiClient 获取卖家的产品和订单数据
  const [productsRes, ordersRes] = await Promise.all([
    apiClient.get('/marketplace/products'),
    apiClient.get('/marketplace/orders'),
  ]);

  const productsData = productsRes.data;
  const ordersData = ordersRes.data;

  return { products: productsData.data, orders: ordersData.data };
}

export default function SellerDashboard() {
  const { products, orders } = useLoaderData<typeof loader>();
  const { user } = useAuth();

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = confirm('确定要删除此产品吗？');
    if (!confirmDelete) return;

    try {
      const res = await apiClient.delete(`/marketplace/products/${id}`);
      if (res.status === 200) {
        // 刷新页面或更新产品列表状态
        window.location.reload();
      } else {
        // 处理错误
        const errorData = res.data;
        alert(`删除失败：${errorData.error}`);
      }
    } catch (error: any) {
      console.error('删除产品时发生错误:', error);
      alert('删除产品时发生错误');
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">卖家仪表板</h1>
        <SellerInfo user={user} />
        <ProductList products={products} onDelete={handleDeleteProduct} />
        <OrderList orders={orders} />
      </div>
    </PageLayout>
  );
}
