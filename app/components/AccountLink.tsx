// app/components/AccountLink.tsx

import React from 'react';
import { Link } from '@remix-run/react';
import { useAuth } from './SellerAuthProvider';
import { IconLogin, IconAccount } from './Icon';

interface AccountLinkProps {
  className?: string;
}

export function AccountLink({ className }: AccountLinkProps) {
  const { user, loading } = useAuth();

  return (
    <Link to={user ? "/account" : "/seller/login"} className={className}>
      {loading ? (
        <IconLogin />
      ) : user ? (
        <IconAccount />
      ) : (
        <IconLogin />
      )}
    </Link>
  );
}
