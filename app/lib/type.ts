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
  price: number;
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

