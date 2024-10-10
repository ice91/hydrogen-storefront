// app/components/SellerProductManager.tsx

import React from 'react';
import { Link } from '@remix-run/react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  availableForSale: boolean;
}

interface SellerProductManagerProps {
  products: {
    edges: {
      node: Product;
    }[];
  };
}

export const SellerProductManager: React.FC<SellerProductManagerProps> = ({ products }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">我的产品</h3>
        <Link to="/seller/products/new" className="px-4 py-2 bg-blue-500 text-white rounded">
          新增产品
        </Link>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">标题</th>
            <th className="px-4 py-2">描述</th>
            <th className="px-4 py-2">价格</th>
            <th className="px-4 py-2">状态</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.edges.map(({ node }) => (
            <tr key={node.id} className="border-t">
              <td className="px-4 py-2">{node.title}</td>
              <td className="px-4 py-2">{node.description}</td>
              <td className="px-4 py-2">${node.price.toFixed(2)}</td>
              <td className="px-4 py-2">
                {node.availableForSale ? '上架中' : '已下架'}
              </td>
              <td className="px-4 py-2">
                <Link to={`/seller/products/${node.id}/edit`} className="text-blue-500 mr-2">
                  编辑
                </Link>
                <button className="text-red-500">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
