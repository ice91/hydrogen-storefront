// app/components/Marketplace/ProductList.tsx

import React, { useEffect, useState } from 'react';
import apiClient from '~/lib/apiClient';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products/mine');
      setProducts(response.data.products);
    } catch (err: any) {
      console.error('获取产品列表时出错：', err);
      setError('无法获取产品列表。');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">我的产品</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
