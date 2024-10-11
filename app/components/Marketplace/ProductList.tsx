// app/components/Marketplace/ProductList.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './SellerAuthProvider';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  status: 'draft' | 'published' | 'sold' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">产品列表</h2>
        <Link to="/marketplace/products/new" className="px-4 py-2 bg-green-500 text-white rounded-md">
          创建新产品
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">标题</th>
            <th className="py-2 px-4 border-b">描述</th>
            <th className="py-2 px-4 border-b">价格</th>
            <th className="py-2 px-4 border-b">库存</th>
            <th className="py-2 px-4 border-b">状态</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.title}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{product.stock}</td>
              <td className="py-2 px-4 border-b">{product.status === 'published' ? '已发布' : product.status === 'draft' ? '草稿' : product.status === 'sold' ? '已售出' : '已删除'}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <Link to={`/marketplace/products/${product.id}`} className="px-2 py-1 bg-blue-500 text-white rounded-md">
                  编辑
                </Link>
                <button
                  onClick={() => onDelete(product.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
