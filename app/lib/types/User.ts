// app/lib/types/User.ts

import type { ObjectId } from "mongodb";
import type { Timestamps } from "./Timestamps";

export interface User extends Timestamps {
  _id: ObjectId;
  username?: string;
  name: string;
  email?: string;
  points: number;
  subscriptionStatus: string;
  subscriptionPlan?: string;
  subscriptionExpiry?: Date;
  referralCode?: string;
  stripeCustomerId?: string;
  avatarUrl?: string;
  hfUserId: string;
  isAdmin?: boolean;
  isEarlyAccess?: boolean;
  storefrontUrl?: string;
  earnings?: number;
  paymentDetails?: any;
  roles?: string[]; // 新增字段
  createdAt: Date;
  updatedAt: Date;
}
