// app/components/Marketplace/ProductCard.tsx

import React from 'react';
import { Product } from '~/lib/type';
import { Link } from 'react-router-dom';
import apiClient from '~/lib/apiClient';
import { useSellerAuth } from './SellerAuthProvider';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { user } = useSellerAuth();

  // 删除产品
  const deleteProduct = async () => {
    if (!window.confirm('您确定要删除此产品吗？')) return;
    try {
      await apiClient.delete(`/products/${product._id}`);
      alert('产品删除成功');
      window.location.reload(); // 简单刷新页面以更新产品列表
    } catch (err) {
      console.error('删除产品时出错：', err);
      alert('删除产品时出错。');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <img
        src={product.images[0] || '/placeholder.png'}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold">{product.title}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
      <p className="mt-1 text-sm text-gray-500">状态：{product.status === 'published' ? '已发布' : '草稿'}</p>
      <div className="mt-4 flex space-x-2">
        <Link to={`/seller/products/${product._id}/edit`} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          编辑
        </Link>
        <button onClick={deleteProduct} className="px-4 py-2 bg-red-500 text-white rounded-md">
          删除
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
