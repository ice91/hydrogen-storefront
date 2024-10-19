// app/routes/seller/dashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { PageLayout } from "~/components/PageLayout";
import apiClient from "~/lib/apiClient";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  // 在客户端加载 JWT
  useEffect(() => {
    // 检查是否在浏览器环境中
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      if (!token) {
        // 如果没有 JWT，重定向到登录页面
        navigate("/seller/login");
      } else {
        setJwt(token);
        console.log(`jwt: [${token}]`);
      }
    }
  }, [navigate]);

  // 根据 JWT 获取用户信息
  useEffect(() => {
    if (!jwt) return;

    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/auth/seller/user", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log("User data fetched:", response.data);
        setUser(response.data.user); // 根据后端返回的数据结构，可能需要调整
      } catch (error: any) {
        console.error("获取用户信息时发生错误:", error);
        // 如果未授权，重定向到登录页面
        navigate("/seller/login");
      }
    };

    fetchUser();
  }, [jwt, navigate]);

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
        <h1>Welcome, {user.name}!</h1>
        <p>Your email: {user.email}</p>
        <p>Points: {user.points}</p>
        <p>Referral Code: {user.code}</p>
      </div>
    </PageLayout>
  );
}