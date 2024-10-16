// app/routes/($locale).seller.login.tsx

import React, { useEffect } from "react";
import { PageLayout } from "~/components/PageLayout";

export default function SellerLogin() {
  useEffect(() => {
    // 直接将浏览器重定向到后端的登录 URL
    window.location.href = "/api/auth/seller/login";
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在跳转到登录页面...</p>
      </div>
    </PageLayout>
  );
}
