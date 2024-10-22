// app/routes/seller/dashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { PageLayout } from "~/components/PageLayout";
import apiClient from "~/lib/apiClient";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // 根據 Cookie 中的 JWT 獲取用戶信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/auth/seller/user");
        console.log("User data fetched:", response.data);
        setUser(response.data.user); // 根據後端返回的數據結構，可能需要調整
      } catch (error: any) {
        console.error("獲取用戶信息時發生錯誤:", error);
        // 如果未授權，重定向到登錄頁面
        //navigate("/seller/login");
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p>Loading seller information...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1>歡迎, {user.name}!</h1>
        <p>您的電子郵件: {user.email}</p>
        <p>積分: {user.points}</p>
        <p>推薦碼: {user.code}</p>
      </div>
    </PageLayout>
  );
}
