// app/routes/auth.callback.tsx

import React, { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { PageLayout } from "~/components/PageLayout";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 直接重定向到賣家儀表板
    navigate("/seller/dashboard");
  }, [navigate]);

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <p>正在認證，請稍候...</p>
      </div>
    </PageLayout>
  );
};

export default AuthCallback;
