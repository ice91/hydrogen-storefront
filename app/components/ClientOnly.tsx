import { useEffect, useState } from 'react';

type ClientOnlyProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 在客戶端環境中設置為 true
    setIsClient(true);
  }, []);

  if (isClient) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
