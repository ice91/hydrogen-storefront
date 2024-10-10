// app/lib/types/Order.ts

import type { ObjectId } from "mongodb";
import type { Timestamps } from "./Timestamps";

export interface Order extends Timestamps {
  _id: ObjectId;
  userId: ObjectId; // 买家 ID
  productId: ObjectId;
  sellerId: ObjectId; // 销售者 ID
  shopifyOrderId: string;
  status: 'pending' | 'completed' | 'failed';
  paymentStatus: 'paid' | 'unpaid';
  totalAmount: number;
  paymentMethod?: string; // 新增字段（可选）
  createdAt: Date;
  updatedAt: Date;
}
