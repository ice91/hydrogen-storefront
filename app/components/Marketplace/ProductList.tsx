// app/components/Marketplace/ProductList.tsx

import React, { useEffect, useState } from 'react';
import apiClient from '~/lib/apiClient';
import ProductCard from './ProductCard';
import { Product } from '~/lib/type';
import { useSellerAuth } from './SellerAuthProvider';

const ProductList: React.FC = () => {
  const { user, loading: authLoading } = useSellerAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取卖家的产品列表
  const fetchProducts = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/products/mine');
      setProducts(response.data.products);
    } catch (err) {
      console.error('获取产品列表时出错：', err);
      setError('无法获取产品列表。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  if (authLoading || loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">我的产品</h2>
      {products.length === 0 ? (
        <p>您尚未创建任何产品。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
