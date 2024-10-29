// app/routes/($locale).seller.products.new.tsx

import React from 'react';
import ProductForm from '~/components/Marketplace/ProductForm';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider';
import { Navigate } from '@remix-run/react';

const NewProduct: React.FC = () => {
  const { user, loading } = useSellerAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>載入中...</p>
      </div>
    );
  }

  if (!user || !user.roles.includes('seller')) {
    return <Navigate to="/seller/login" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      <ProductForm />
    </div>
  );
};

export default NewProduct;
