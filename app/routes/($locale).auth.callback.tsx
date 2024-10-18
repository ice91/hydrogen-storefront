// app/routes/auth.callback.tsx

import React, { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { PageLayout } from "~/components/PageLayout";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      console.log(`token: [${token}]`);

      if (token) {
        // 将 JWT 存储在 localStorage 中
        localStorage.setItem("jwt", token);
        console.log(`jwt: [${localStorage.getItem("jwt")}]`);
        // 可选：从 URL 中移除 token 参数
        window.history.replaceState({}, document.title, "/");

        // 重定向到卖家仪表板或其他页面
        console.log(`navigate_dashboard`);
        navigate("/seller/dashboard");
      } else {
        // 处理错误情况，例如未获取到 token
        alert("认证失败");
        //navigate("/seller/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在认证，请稍候...</p>
      </div>
    </PageLayout>
  );
};

export default AuthCallback;