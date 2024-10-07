# Updated 專案需求文件（PRD）

## 一、專案概述

### 1.1 目標

將現有的 **HuggingChat UI** 系統擴展為一個獨立的 **Marketplace** 平台，允許用戶（賣家）創建、管理並銷售 AI 生成的藝術作品。該平台將使用 **Shopify Hydrogen 框架** 作為前端，並在其內部集成後端功能（使用 TypeScript 開發），以處理複雜的業務邏輯和數據管理。

同時，需考慮到買家與賣家是不同的用戶群體：

- **賣家**：與 HuggingChat UI 共用認證機制和數據模型，使用 OIDC 認證。
- **買家**：使用 Shopify 的用戶認證，內建於 Hydrogen 框架中。

### 1.2 背景

- **現有功能**：
  - 用戶認證（透過 OIDC，針對賣家）
  - 訂閱管理（使用 Stripe）
  - MongoDB 數據庫

- **計劃擴展**：
  - 整合 **Gelato API**，實現產品上架到 Shopify 商店
  - 使用 **Shopify Hydrogen 框架**，構建自定義前端
  - 在 Hydrogen 框架內集成後端功能（使用 TypeScript 開發）
  - 考慮買家與賣家不同的用戶身份和認證方式

---

## 二、目標與目的

- **建立獨立的 Marketplace 平台**：允許賣家創建、管理及銷售 AI 生成的藝術作品，買家可以方便地瀏覽和購買產品。
- **整合 Shopify Hydrogen 框架**：使用 Hydrogen 框架構建高度自定義的前端，並在其內部集成後端功能。
- **最小化開發成本**：利用現有的 HuggingChat UI 系統和第三方服務，減少重複開發。
- **區分買家與賣家的用戶體驗**：賣家使用現有的認證系統，買家使用 Shopify 的認證機制。
- **提升用戶體驗**：提供友好的用戶界面和便捷的操作流程，確保優秀的性能和 SEO 表現。

---

## 三、範圍

### 3.1 包含

- **賣家功能**：
  - 用戶認證與授權（共用 HuggingChat UI 的認證）
  - 產品管理
  - 收益管理
  - 用戶店面頁面

- **買家功能**：
  - 商品瀏覽與搜索
  - 購物車與結帳流程（使用 Shopify 內建功能）
  - 訂單追蹤與管理（透過 Shopify 提供）

- **系統功能**：
  - Marketplace 展示
  - 訂單與支付處理
  - 數據同步與一致性

### 3.2 不包含

- 高級分析與推薦系統（可作為未來擴展）
- 非核心功能如社交分享、評論系統等（可後續添加）

---

## 四、核心功能與數據模型

### 4.1 賣家功能

#### 4.1.1 用戶認證與授權（**必須功能**）

**描述**：賣家使用與 HuggingChat UI 共用的認證系統（OIDC）登入和管理產品。

**需求細節**：

- **用戶認證**：
  - 賣家透過 OIDC 認證機制登入。
  - 與 HuggingChat UI 保持一致的用戶體驗。

- **授權與權限控制**：
  - 實施基於角色的存取控制（RBAC），區分賣家和管理員。
  - 賣家只能管理自己的產品和資料。

**數據模型**：

```typescript
export interface User extends Timestamps {
  _id: ObjectId;
  username: string;
  email: string;
  name: string;
  roles: string[]; // ['seller', 'admin']
  avatarUrl?: string;
  storefrontUrl?: string;
  earnings?: number;
  paymentDetails?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}
```

**文件結構影響**：

- **後端**：
  - `/server/auth.ts`：處理賣家的認證與授權邏輯。

- **前端**：
  - `/app/routes/seller/login.tsx`：賣家登入頁面。
  - `/app/components/SellerAuthProvider.tsx`：處理賣家認證狀態。

**實施細節**：

- 在 `/server/auth.ts` 中實現 OIDC 認證流程，使用現有的 HuggingChat UI 認證服務器。
- 在前端使用 React Context 管理賣家的認證狀態。
- 在需要保護的路由中，使用 `SellerAuthProvider` 進行權限檢查。

#### 4.1.2 產品管理（**必須功能**）

**描述**：賣家可以創建、編輯、刪除藝術作品，並上架至 Shopify 商店。

**需求細節**：

- **創建產品**：
  - 賣家通過表單輸入產品資訊和上傳圖片。
  - 保存產品資料到 MongoDB 的 `Product` 集合。
  - 使用 **Gelato API** 創建產品模板，獲取 `podProductId`。
  - 使用 **Shopify API** 將產品上架，獲取 `shopifyProductId`。

- **編輯與刪除產品**：
  - 賣家可以編輯產品資訊，變更同步至 Shopify 和 Gelato。
  - 刪除產品時，同步刪除 Shopify 商店中的產品。

**數據模型**：

```typescript
export interface Product extends Timestamps {
  _id: ObjectId;
  sellerId: ObjectId; // 賣家ID，與 User._id 對應
  title: string;
  description: string;
  images: string[]; // 圖片URL列表
  price: number;
  shopifyProductId?: string;
  podProductId?: string;
  status: 'draft' | 'published' | 'deleted';
  tags?: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**文件結構影響**：

- **後端**：
  - `/server/controllers/productController.ts`：處理產品邏輯。
  - `/server/routes/productRoutes.ts`：產品相關的 API 路由。

- **前端**：
  - `/app/routes/seller/products/create.tsx`：產品創建頁面。
  - `/app/routes/seller/products/edit.tsx`：產品編輯頁面。
  - `/app/components/Seller/ProductForm.tsx`：產品表單組件。

**實施細節**：

- 在 `/server/controllers/productController.ts` 中實現產品的 CRUD 操作，以及與 Shopify 和 Gelato 的同步邏輯。
- 前端的產品表單提交後，調用 `/api/products` 的相應 API。

#### 4.1.3 收益管理（**選擇性功能**）

**描述**：賣家可以查看自己的銷售收益，並處理收益結算。

**需求細節**：

- **收益查看**：
  - 賣家在個人中心查看總收益和交易明細。

- **收益結算**：
  - 使用 **Stripe Connect** 進行收益分配和支付。

**數據模型**：

```typescript
export interface Earning extends Timestamps {
  _id: ObjectId;
  sellerId: ObjectId; // 賣家ID
  orderId: ObjectId;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

**文件結構影響**：

- **後端**：
  - `/server/controllers/earningsController.ts`：處理收益邏輯。
  - `/server/routes/earningsRoutes.ts`：收益相關的 API 路由。

- **前端**：
  - `/app/routes/seller/earnings.tsx`：收益查看頁面。
  - `/app/components/Seller/EarningsDashboard.tsx`：收益儀表板組件。

**實施細節**：

- 在後端實現與 Stripe Connect 的集成，處理收益的分配和支付。
- 前端調用 `/api/earnings` 獲取收益數據，展示在儀表板中。

#### 4.1.4 用戶店面頁面（**選擇性功能**）

**描述**：為每個賣家提供個人化的店面頁面，展示其所有產品。

**需求細節**：

- **店面頁面**：
  - URL 結構：`/storefront/:sellerUsername`。
  - 顯示賣家的個人資訊和產品列表。

**數據模型**：

```typescript
// 可直接使用 User 模型中的 storefrontUrl
```

**文件結構影響**：

- **前端**：
  - `/app/routes/storefront/$sellerUsername.tsx`：賣家店面頁面。
  - `/app/components/StorefrontHeader.tsx`：店面頭部組件。

**實施細節**：

- 在 `/app/routes/storefront/$sellerUsername.tsx` 中，通過 `sellerUsername` 查找賣家資訊和其產品列表。

### 4.2 買家功能

#### 4.2.1 商品瀏覽與搜索（**必須功能**）

**描述**：買家可以瀏覽所有上架的產品，並進行搜索和篩選。

**需求細節**：

- **產品列表展示**：
  - 顯示所有 `status: 'published'` 的產品。
  - 支持按分類、標籤、賣家篩選和搜索。

- **產品詳情頁面**：
  - 顯示產品的詳細資訊和購買選項。

**文件結構影響**：

- **前端**：
  - `/app/routes/index.tsx`：Marketplace 主頁。
  - `/app/routes/products/$productHandle.tsx`：產品詳情頁面。
  - `/app/components/ProductCard.tsx`：產品卡片組件。
  - `/app/components/FilterSort.tsx`：篩選和排序組件。

**實施細節**：

- 前端從後端 API 獲取產品列表，或直接從 Shopify Storefront API 獲取。
- 在產品詳情頁，提供 "加入購物車" 的功能。

#### 4.2.2 購物車與結帳流程（**必須功能**）

**描述**：買家可以將產品加入購物車，並通過 Shopify 的結帳流程完成購買。

**需求細節**：

- **購物車功能**：
  - 買家可以將產品加入購物車。
  - 購物車資訊存儲在客戶端，或使用 Shopify 提供的購物車 API。

- **結帳流程**：
  - 使用 Shopify 提供的結帳頁面。
  - 買家可選擇是否登入 Shopify 帳戶。

**文件結構影響**：

- **前端**：
  - `/app/components/Cart.tsx`：購物車組件。
  - `/app/routes/cart.tsx`：購物車頁面。

**實施細節**：

- 使用 Shopify Hydrogen 提供的購物車和結帳組件，簡化實現。

#### 4.2.3 訂單追蹤與管理（**選擇性功能**）

**描述**：買家可以查看自己的訂單狀態和歷史。

**需求細節**：

- **訂單查看**：
  - 買家在登入後可以查看訂單狀態。

**文件結構影響**：

- **前端**：
  - `/app/routes/account/orders.tsx`：買家訂單頁面。
  - `/app/components/OrderList.tsx`：訂單列表組件。

**實施細節**：

- 使用 Shopify 提供的客戶端功能，買家可以查看訂單資訊。

### 4.3 系統功能

#### 4.3.1 訂單與支付處理（**必須功能**）

**描述**：處理訂單的同步和支付，賣家可以查看訂單狀態。

**需求細節**：

- **訂單同步**：
  - 設置 Shopify Webhook，接收訂單狀態更新。
  - 更新 MongoDB 的 `Order` 集合，保存訂單資訊。

- **收益計算**：
  - 根據訂單金額計算賣家收益，更新 `Earning` 模型。

**數據模型**：

```typescript
export interface Order extends Timestamps {
  _id: ObjectId;
  shopifyOrderId: string;
  productId: ObjectId;
  sellerId: ObjectId;
  amount: number;
  commission: number;
  earnings: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

**文件結構影響**：

- **後端**：
  - `/server/controllers/orderController.ts`：處理訂單邏輯。
  - `/server/routes/orderRoutes.ts`：訂單相關的 API 路由。
  - `/server/webhooks/shopifyWebhook.ts`：處理 Shopify Webhook。

**實施細節**：

- 在 `/server/webhooks/shopifyWebhook.ts` 中，處理來自 Shopify 的訂單事件，更新本地訂單資料和賣家收益。

---

## 五、技術細節與文件結構

### 5.1 技術棧

- **開發語言**：TypeScript
- **前端框架**：Shopify Hydrogen（基於 React）
- **後端框架**：Node.js 和 Express（集成在 Hydrogen 框架內）
- **數據庫**：MongoDB（使用 Mongoose 進行數據建模）
- **樣式**：Tailwind CSS
- **狀態管理**：React Hooks 和 Context API
- **認證機制**：
  - **賣家**：使用 OIDC，與 HuggingChat UI 共用。
  - **買家**：使用 Shopify 內建的客戶認證。

### 5.2 文件結構

為了減少文件數量，我們將文件結構簡化，同時確保功能完整性。

**根目錄結構**：

```
project/
├── app/
│   ├── components/
│   ├── routes/
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx
│   └── styles/
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── webhooks/
│   ├── models/
│   └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── ...
```

**詳細結構與說明**：

- **app/**：前端代碼，包括頁面路由、組件和樣式。

  - **components/**：UI 組件。

    - `SellerAuthProvider.tsx`：賣家認證狀態管理。
    - `ProductForm.tsx`：產品表單組件。
    - `ProductCard.tsx`：產品卡片組件。
    - `Cart.tsx`：購物車組件。
    - `FilterSort.tsx`：篩選和排序組件。
    - `EarningsDashboard.tsx`：收益儀表板組件。
    - `OrderList.tsx`：訂單列表組件。
    - `StorefrontHeader.tsx`：店面頭部組件。

  - **routes/**：頁面路由。

    - `index.tsx`：Marketplace 主頁。
    - `products.tsx`：產品列表頁（可選，若與主頁合併則不需要）。
    - `products.$productHandle.tsx`：產品詳情頁。
    - `seller.tsx`：賣家主頁（可選）。
    - `seller.login.tsx`：賣家登入頁面。
    - `seller.products.tsx`：賣家產品管理頁面。
    - `seller.earnings.tsx`：賣家收益頁面。
    - `storefront.$sellerUsername.tsx`：賣家店面頁面。
    - `cart.tsx`：購物車頁面。
    - `account.orders.tsx`：買家訂單頁面。

  - **styles/**：樣式文件。

    - `app.css`：全局樣式。

- **server/**：後端代碼，包括控制器、路由、模型和 Webhook。

  - **controllers/**：處理業務邏輯。

    - `authController.ts`：認證與授權。
    - `productController.ts`：產品邏輯。
    - `orderController.ts`：訂單邏輯。
    - `earningsController.ts`：收益邏輯。

  - **routes/**：API 路由。

    - `authRoutes.ts`：認證相關 API。
    - `productRoutes.ts`：產品相關 API。
    - `orderRoutes.ts`：訂單相關 API。
    - `earningsRoutes.ts`：收益相關 API。

  - **webhooks/**：處理 Webhook。

    - `shopifyWebhook.ts`：處理 Shopify Webhook。

  - **models/**：資料模型。

    - `User.ts`：用戶模型。
    - `Product.ts`：產品模型。
    - `Order.ts`：訂單模型。
    - `Earning.ts`：收益模型。

  - **index.ts**：後端入口文件。

### 5.3 關鍵技術點與實施細節

#### 5.3.1 前後端集成

- **自定義服務器**：在 `server/index.ts` 中設置 Express 服務器，並在 `app/entry.server.tsx` 中引入。
- **API 路由**：通過 Express 定義 API 路由，前端通過 Fetch API 調用。
- **Hydrogen 與後端共享**：利用 Remix 的 Loader 和 Action，實現服務器端數據加載和處理。

#### 5.3.2 賣家認證與權限控制

- **OIDC 認證**：在後端設置 OIDC 認證流程，使用現有的認證服務器。
- **前端認證狀態管理**：使用 React Context 管理賣家的認證狀態。
- **路由保護**：對 `/seller/*` 路由進行保護，未登入賣家將被重定向到登入頁面。

#### 5.3.3 賣家產品管理

- **產品創建與編輯**：在前端提供產品表單，提交後調用後端 API 保存到 MongoDB，並同步到 Shopify 和 Gelato。
- **圖片上傳**：支持圖片上傳，存儲在雲端存儲服務，如 AWS S3。
- **產品同步**：使用 Shopify 和 Gelato 的 API，同步產品資料。

#### 5.3.4 買家購物流程

- **購物車與結帳**：使用 Shopify Hydrogen 提供的購物車和結帳組件，無需自行實現複雜的購物流程。
- **產品展示**：從 Shopify Storefront API 獲取產品資料，展示在前端。
- **買家認證**：可選，使用 Shopify 的客戶認證系統。

#### 5.3.5 訂單與收益管理

- **訂單同步**：設置 Shopify Webhook，當有訂單創建或更新時，觸發後端處理，更新訂單和收益資料。
- **收益計算**：在後端根據訂單金額計算賣家的收益，並更新 `Earning` 模型。
- **支付分潤**：使用 Stripe Connect，自動化收益結算流程。

---

## 六、項目文件結構總覽

為了更好地協調開發，我們在此提供完整的文件結構，包含關鍵文件，並盡量減少文件數量。

```
project/
├── app/
│   ├── components/
│   │   ├── Cart.tsx
│   │   ├── EarningsDashboard.tsx
│   │   ├── FilterSort.tsx
│   │   ├── OrderList.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductForm.tsx
│   │   ├── SellerAuthProvider.tsx
│   │   └── StorefrontHeader.tsx
│   ├── routes/
│   │   ├── account.orders.tsx
│   │   ├── cart.tsx
│   │   ├── index.tsx
│   │   ├── products.$productHandle.tsx
│   │   ├── seller.earnings.tsx
│   │   ├── seller.login.tsx
│   │   ├── seller.products.tsx
│   │   └── storefront.$sellerUsername.tsx
│   ├── styles/
│   │   └── app.css
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   └── root.tsx
├── server/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── earningsController.ts
│   │   ├── orderController.ts
│   │   └── productController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── earningsRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── productRoutes.ts
│   ├── webhooks/
│   │   └── shopifyWebhook.ts
│   ├── models/
│   │   ├── Earning.ts
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── ...

```

**說明**：

- 將組件和路由文件盡可能地合併，避免過多的文件。

- **組件**：

  - 將所有通用組件放在 `/app/components/` 中，避免過度細分。

- **路由**：

  - 使用扁平化的路由結構，盡量減少嵌套。

- **後端**：

  - 將控制器和路由文件合併，例如，如果路由邏輯較少，可以在 `routes` 文件中直接寫控制器函數。

- **樣式**：

  - 所有樣式統一放在 `app.css` 中，使用 Tailwind CSS，避免過多的樣式文件。

---

## 七、開發指南與協作約定

### 7.1 代碼風格

- **使用 TypeScript**：所有代碼均使用 TypeScript，嚴格類型檢查。

- **代碼格式化**：使用 Prettier 進行代碼格式化，統一代碼風格。

- **Lint 工具**：使用 ESLint，遵循社區最佳實踐。

### 7.2 Git 流程

- **分支策略**：使用 Git Flow，主分支為 `main`，開發分支為 `develop`。

- **Commit 信息**：遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範。

### 7.3 開發流程

1. **環境設置**：克隆項目，安裝依賴，配置環境變量。

2. **任務分配**：根據需求分配任務，創建對應的開發分支。

3. **開發實施**：按照文件結構和代碼風格進行開發。

4. **代碼審查**：提交 Pull Request，進行代碼審查。

5. **合併與部署**：審查通過後合併到 `develop`，測試無誤後合併到 `main`，進行部署。

### 7.4 注意事項

- **避免過度設計**：盡量簡化代碼和文件結構，避免不必要的複雜性。

- **模塊復用**：盡量重用組件和模塊，避免代碼重複。

- **性能優化**：注意前端性能，使用懶加載和代碼分割。

- **安全性**：保護用戶資料，防範常見的安全漏洞。

---

## 八、時間計劃與里程碑

1. **需求分析與設計**（第 1 週）
   - 確定項目範圍和技術方案。
   - 設計數據模型和文件結構。

2. **環境搭建與基礎設施**（第 2 週）
   - 設置開發環境和版本控制。
   - 搭建基本的前後端框架。

3. **賣家功能開發**（第 3-4 週）
   - 實現賣家認證與授權。
   - 開發產品管理功能。
   - 整合 Shopify 和 Gelato API。

4. **買家功能開發**（第 5-6 週）
   - 實現商品瀏覽與搜索。
   - 實現購物車與結帳流程。

5. **系統功能開發**（第 7 週）
   - 實現訂單與支付處理。
   - 設置 Webhook，處理訂單同步。

6. **測試與優化**（第 8 週）
   - 進行功能測試和性能優化。
   - 修復 Bug，完善文檔。

7. **部署與發布**（第 9 週）
   - 部署到測試環境，進行最終驗收。
   - 部署到生產環境，正式上線。

---

## 九、總結

該項目旨在建立一個基於 Shopify Hydrogen 框架的 AI 藝術作品 Marketplace。通過簡化文件結構和明確的功能劃分，確保開發人員能夠高效協作，快速交付。同時，充分利用現有的資源和第三方服務，降低開發成本。

請所有開發人員嚴格遵守此 PRD，並在開發過程中保持溝通，如有問題及時反饋。
