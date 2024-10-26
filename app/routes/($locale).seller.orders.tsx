// app/routes/($locale).seller.orders.tsx

import React from 'react';
import { PageLayout } from '~/components/PageLayout';
import OrderList from '~/components/Marketplace/OrderList';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider';
import { Navigate } from '@remix-run/react';

const SellerOrders: React.FC = () => {
  const { user, loading } = useSellerAuth();

  if (loading) {
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

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">我的订单</h2>
        <OrderList />
      </div>
    </PageLayout>
  );
};

export default SellerOrders;
