// app/lib/types/Storefront.ts

import type { ObjectId } from "mongodb";
import type { Timestamps } from "./Timestamps";

export interface Storefront extends Timestamps {
  _id: ObjectId;
  userId: ObjectId;
  storefrontUrl: string;
  bannerImageUrl?: string; // 店面横幅图片（可选）
  theme?: string; // 店面主题（可选）
  createdAt: Date;
  updatedAt: Date;
}
