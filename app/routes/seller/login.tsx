import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    // 重定向至後端的 OIDC 登入路由
    window.location.href = '/api/auth/login';
  }, []);

  return (
    <div>
      <p>正在重定向到登入頁面...</p>
    </div>
  );
};

export default Login;