// app/routes/($locale).seller.products.tsx

import React from 'react';
import { PageLayout } from '~/components/PageLayout';
import ProductList from '~/components/Marketplace/ProductList';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider';
import { Navigate } from '@remix-run/react';

const SellerProducts: React.FC = () => {
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
        <h2 className="text-2xl font-semibold mb-4">我的产品</h2>
        <ProductList />
        <div className="mt-4">
          <a href="/seller/products/new" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            创建新产品
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default SellerProducts;
