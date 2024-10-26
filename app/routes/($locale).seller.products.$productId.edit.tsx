// app/routes/($locale).seller.products.$productId.edit.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
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
        setError('产品 ID 无效。');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/products/${productId}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error('获取产品详情时出错：', err);
        setError('无法获取产品详情。');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

  if (error || !product) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error || '产品不存在。'}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">编辑产品</h2>
        <ProductForm product={product} />
      </div>
    </PageLayout>
  );
};

export default EditProduct;
