// app/components/CartCount.tsx

import React from 'react';
import { useRouteLoaderData, Await } from '@remix-run/react';
import { Badge } from './Badge';
import type { RootLoader } from '~/root';

interface CartCountProps {
  isHome: boolean;
  openCart: () => void;
}

export function CartCount({ isHome, openCart }: CartCountProps) {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={data.cart}>
        {(cartData: any) => <Badge dark={isHome} openCart={openCart} count={cartData?.totalQuantity || 0} />}
      </Await>
    </Suspense>
  );
}
