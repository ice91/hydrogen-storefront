// app/routes/seller/dashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { PageLayout } from "~/components/PageLayout";
import apiClient from "~/lib/apiClient";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 假设有一个 API 端点可以获取当前用户信息
        const response = await apiClient.get("/user/me");
        setUser(response.data);
      } catch (error: any) {
        console.error("获取用户信息时发生错误:", error);
        // 如果未授权，重定向到登录页面
        navigate("/seller/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p>正在加载卖家信息...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1>欢迎，{user.name}！</h1>
        <p>您的电子邮件：{user.email}</p>
        {/* 添加更多卖家相关信息和功能 */}
      </div>
    </PageLayout>
  );
}