// app/routes/($locale).seller.login.tsx

import React, { useEffect } from "react";
import { PageLayout } from "~/components/PageLayout";

export default function SellerLogin() {
  useEffect(() => {
    // 使用環境變量構建後端登錄 URL
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "https://localhost:5173";
    window.location.href = `${backendBaseUrl}/api/auth/seller/login`;
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在跳轉到登錄頁面...</p>
      </div>
    </PageLayout>
  );
}
