// app/routes/($locale).seller.dashboard.tsx

import React from 'react';
import { PageLayout } from '~/components/PageLayout';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider';
import ProductList from '~/components/Marketplace/ProductList';
import OrderList from '~/components/Marketplace/OrderList';
import SellerInfo from '~/components/Marketplace/SellerInfo';
import { Navigate } from '@remix-run/react';

const SellerDashboard: React.FC = () => {
  const { user, loading, logout } = useSellerAuth();

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p>加载中...</p>
        </div>
      </PageLayout>
    );
  }

  /*if (!user || !user.roles.includes('seller')) {
    return <Navigate to="/seller/login" replace />;
  }*/

  return (
    <PageLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">欢迎, {user.name}!</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-md">
            退出登录
          </button>
        </div>
        <SellerInfo />
        <ProductList />
        <OrderList />
      </div>
    </PageLayout>
  );
};

export default SellerDashboard;
