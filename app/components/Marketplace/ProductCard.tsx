// app/components/Marketplace/ProductCard.tsx

import React from 'react';
import { Product } from '~/lib/types/Product';
import { Link } from '@remix-run/react';
import apiClient from '~/lib/apiClient';
import { useSellerAuth } from './SellerAuthProvider';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { user } = useSellerAuth();

  // 刪除產品
  const deleteProduct = async () => {
    if (!window.confirm('您確定要刪除此產品嗎？')) return;
    try {
      await apiClient.delete(`/products/${product._id}`);
      alert('產品刪除成功');
      window.location.reload(); // 簡單刷新頁面以更新產品列表
    } catch (err) {
      console.error('刪除產品時出錯：', err);
      alert('刪除產品時出錯。');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
      <img
        src={product.images[0] || '/placeholder.png'}
        alt={product.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-xl font-bold text-green-600">${product.price.toFixed(2)}</p>
        {/* 狀態標籤 */}
        <span
          className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {product.status === 'active' ? '已發布' : '草稿'}
        </span>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Link
              to={`/seller/editproducts/${product._id}`}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
            >
              編輯
            </Link>
            <button
              onClick={deleteProduct}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded-md"
            >
              刪除
            </button>
          </div>
          {/* 預覽鏈接 */}
          {product.handle ? (
            <Link
              to={`/products/${product.handle}`}
              target="_blank"
              className="text-sm text-blue-500 hover:underline"
            >
              預覽
            </Link>
          ) : (
            <span className="text-sm text-gray-500">無法預覽</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
