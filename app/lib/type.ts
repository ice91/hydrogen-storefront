// app/lib/type.ts

import type { Storefront as HydrogenStorefront } from '@shopify/hydrogen';
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

// 用戶資訊
export interface User {
  _id: string;
  username?: string;
  name: string;
  email?: string;
  roles: string[]; // 例如: ['seller', 'admin']
  createdAt: string;
  updatedAt: string;
}

// 產品資訊
export interface Product {
  _id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  provider: string; // 例如: 'Gelato'
  providerProductId?: string; // Gelato 上的產品 ID
  shopifyProductId?: string; // Shopify 上的產品 ID
  handle?: string; // Shopify 上的 handle
  productType: string;
  variants?: VariantObject[]; // 參照 ProductTemplate 的 VariantObject
  tags?: string[];
  categories?: string[];
  status?: 'pending' | 'active' | 'creating' | 'failed'; // 狀態包含新的選項
  createdAt: string;
  updatedAt: string;
}

// 訂單資訊
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

// 訂單項目資訊
export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  gelatoItemId?: string;
  fulfillmentStatus: string;
  trackingCodes?: TrackingCode[];
}

// 追蹤代碼資訊
export interface TrackingCode {
  code: string;
  url: string;
  shipmentMethodName: string;
  shipmentMethodUid: string;
  country: string;
  stateProvince: string;
  facilityId: string;
}

// 變體資訊 (擴展至 ProductTemplate)
export interface VariantObject {
  id: string;                       // 變體 ID
  title: string;                    // 變體標題
  productUid: string;               // 產品 UID
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
