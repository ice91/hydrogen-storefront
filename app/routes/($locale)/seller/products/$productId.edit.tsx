// app/routes/($locale).seller.products.$productId.edit.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import ProductForm from '~/components/Marketplace/ProductForm';
import apiClient from '~/lib/apiClient';
import { Product } from '~/lib/type';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider';
import { Navigate } from '@remix-run/react';

const EditProduct: React.FC = () => {
  const { productId } = useParams();
  const { user, loading: authLoading } = useSellerAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('產品 ID 無效。');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/products/${productId}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error('獲取產品詳情時出錯：', err);
        setError('無法獲取產品詳情。');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-4">
        <p>載入中...</p>
      </div>
    );
  }

  if (!user || !user.roles.includes('seller')) {
    return <Navigate to="/seller/login" replace />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error || '產品不存在。'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ProductForm product={product} />
    </div>
  );
};

export default EditProduct;
