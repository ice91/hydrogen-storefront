// app/components/Marketplace/OrderCard.tsx

import React from 'react';
import { Order } from '~/lib/type';
import { Link } from 'react-router-dom';

interface Props {
  order: Order;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h3 className="text-xl font-semibold">订单 ID: {order.shopifyOrderId}</h3>
      <p className="text-gray-600">状态: {order.fulfillmentStatus}</p>
      <p className="mt-2">总金额: ${order.totalAmount.toFixed(2)} {order.currency}</p>
      <p className="mt-1">创建时间: {new Date(order.createdAt).toLocaleString()}</p>
      <Link to={`/seller/orders/${order._id}`} className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-md">
        查看详情
      </Link>
    </div>
  );
};

export default OrderCard;
