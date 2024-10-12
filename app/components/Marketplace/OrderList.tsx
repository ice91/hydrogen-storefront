// app/components/Marketplace/OrderList.tsx

import React from 'react';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="order-list mb-4">
      <h2 className="text-xl font-semibold mb-2">订单管理</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">订单编号</th>
            <th className="py-2 px-4 border-b">客户姓名</th>
            <th className="py-2 px-4 border-b">总金额</th>
            <th className="py-2 px-4 border-b">状态</th>
            <th className="py-2 px-4 border-b">创建时间</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.id}</td>
              <td className="py-2 px-4 border-b">{order.customerName}</td>
              <td className="py-2 px-4 border-b">${order.total.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
