// app/components/Marketplace/ProductList.tsx

import React, { useEffect, useState } from 'react';
import { Product } from '~/lib/types/Product';
import apiClient from '~/lib/apiClient';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/api/products');
        setProducts(response.data.products);
      } catch (err: any) {
        setError(err.response?.data?.error || '無法獲取產品列表');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id.toString()} className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold">{product.title}</h3>
          <p>{product.description}</p>
          <p>價格：${product.price.toFixed(2)}</p>
          <p>狀態：{product.status === 'pending' ? '處理中' : product.status === 'active' ? '上架' : '失敗'}</p>
          {/* 其他產品信息和操作按鈕 */}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
