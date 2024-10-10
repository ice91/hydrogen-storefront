// app/lib/types/Category.ts

import type { ObjectId } from "mongodb";
import type { Timestamps } from "./Timestamps";

export interface Category extends Timestamps {
  _id: ObjectId;
  name: string;
  description?: string;
  parentId?: ObjectId; // 支持子分类（可选）
}
