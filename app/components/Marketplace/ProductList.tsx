// app/components/Marketplace/ProductList.tsx

import React from 'react';
import { Link } from '@remix-run/react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  status: string;
}

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  return (
    <div className="product-list mb-4">
      <h2 className="text-xl font-semibold mb-2">产品管理</h2>
      <Link to="/seller/products/new" className="mb-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md">
        创建新产品
      </Link>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">标题</th>
            <th className="py-2 px-4 border-b">价格</th>
            <th className="py-2 px-4 border-b">库存</th>
            <th className="py-2 px-4 border-b">状态</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.title}</td>
              <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{product.stock}</td>
              <td className="py-2 px-4 border-b">{product.status}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/seller/products/${product.id}`} className="mr-2 text-blue-500 underline">
                  编辑
                </Link>
                <button onClick={() => onDelete(product.id)} className="text-red-500 underline">
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
