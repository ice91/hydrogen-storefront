// app/components/Marketplace/ProductList.tsx

import React, { useEffect, useState } from 'react';
import apiClient from '~/lib/apiClient';
import ProductCard from './ProductCard';
import { Product } from '~/lib/type';
import { Link } from '@remix-run/react';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 10; // 每頁顯示的產品數量

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products/mine', {
        params: { page: currentPage, limit: productsPerPage },
      });
      setProducts(response.data.products);
    } catch (err: any) {
      console.error('獲取產品列表時出錯：', err);
      setError('無法獲取產品列表。');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">我的產品</h2>
        <Link
          to="/seller/products/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          創建新產品
        </Link>
      </div>
      {products.length === 0 ? (
        <p>您還沒有添加任何產品。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {/* 分頁控件 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-md"
        >
          上一頁
        </button>
        <span className="px-4 py-2 bg-white border-t border-b">
          第 {currentPage} 頁
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md"
        >
          下一頁
        </button>
      </div>
    </div>
  );
};

export default ProductList;
