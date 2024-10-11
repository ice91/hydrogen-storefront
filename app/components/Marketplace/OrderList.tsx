// app/components/Marketplace/OrderList.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './SellerAuthProvider';

interface Order {
  id: string;
  buyerName: string;
  productTitle: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const { user } = useAuth();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">订单列表</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">买家</th>
            <th className="py-2 px-4 border-b">产品</th>
            <th className="py-2 px-4 border-b">金额</th>
            <th className="py-2 px-4 border-b">状态</th>
            <th className="py-2 px-4 border-b">创建时间</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.buyerName}</td>
              <td className="py-2 px-4 border-b">{order.productTitle}</td>
              <td className="py-2 px-4 border-b">${order.totalAmount.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/marketplace/orders/${order.id}`} className="px-2 py-1 bg-blue-500 text-white rounded-md">
                  查看
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
