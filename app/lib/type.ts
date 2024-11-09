// app/lib/type.ts

import type {Storefront as HydrogenStorefront} from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export type Storefront = HydrogenStorefront<I18nLocale>;

// app/lib/type.ts

export interface User {
  _id: string;
  username?: string;
  name: string;
  email?: string;
  roles: string[]; // 例如: ['seller', 'admin']
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  //price: number;
  provider: string; // 例如: 'Gelato'
  providerProductId?: string;
  shopifyProductId?: string;
  productType: string;
  variants?: Variant[];
  tags?: string[];
  categories?: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  variantId?: string;
  title: string;
  options: Record<string, string>; // 例如: { Color: 'Red', Size: 'M' }
  imageUrl?: string;
  price?: number;
}

export interface Order {
  _id: string;
  sellerId: string;
  shopifyOrderId: string;
  gelatoOrderId?: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  fulfillmentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  gelatoItemId?: string;
  fulfillmentStatus: string;
  trackingCodes?: TrackingCode[];
}

export interface TrackingCode {
  code: string;
  url: string;
  shipmentMethodName: string;
  shipmentMethodUid: string;
  country: string;
  stateProvince: string;
  facilityId: string;
}

// app/lib/types/ProductTemplate.ts

export interface ProductTemplate {
  templateId: string;               // 模板ID
  templateName: string;             // 模板名稱
  title: string;                    // 產品標題
  description: string;              // 產品描述
  previewUrl: string;               // 預覽圖片URL
  productType?: string;             // 產品類型（可選）
  vendor?: string;                  // 廠商名稱（可選）
  //price?: number;                   // 模板價格（可選）
  category?: string;                // 模板類別（可選）
  variants: VariantObject[];        // 變體列表
  createdAt: string;                // 創建時間
  updatedAt: string;                // 更新時間
}

export interface VariantObject {
  id: string;                       // 變體ID
  title: string;                    // 變體標題
  productUid: string;               // 產品UID
  variantOptions: VariantOptionObject[];   // 變體選項列表
  imagePlaceholders: ImagePlaceholderObject[]; // 圖片佔位符列表
  textPlaceholders?: TextPlaceholderObject[];   // 文字佔位符列表（可選）
}

export interface VariantOptionObject {
  name: string;                     // 變體選項名稱
  value: string;                    // 變體選項值
}

export interface ImagePlaceholderObject {
  name: string;                     // 圖片佔位符名稱
  printArea: string;                // 打印區域名稱
  height: number;                   // 圖片高度
  width: number;                    // 圖片寬度
}

export interface TextPlaceholderObject {
  name: string;                     // 文字佔位符名稱
  text: string;                     // 文字內容
}
