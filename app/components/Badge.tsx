// app/components/Badge.tsx

import React, { useMemo } from 'react';
import { IconBag } from './Icon';
import { useIsHydrated } from '~/hooks/useIsHydrated';

interface BadgeProps {
  count: number;
  dark: boolean;
  openCart: () => void;
}

export function Badge({ openCart, dark, count }: BadgeProps) {
  const isHydrated = useIsHydrated();
  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark]
  );

  return isHydrated ? (
    <button onClick={openCart} className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5">
      {BadgeCounter}
    </button>
  ) : (
    <Link to="/cart" className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5">
      {BadgeCounter}
    </Link>
  );
}
