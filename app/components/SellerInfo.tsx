// app/components/SellerInfo.tsx

import React from 'react';

interface SellerInfoProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export const SellerInfo: React.FC<SellerInfoProps> = ({ user }) => {
  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <div className="flex items-center">
        {user.avatarUrl && (
          <img src={user.avatarUrl} alt={`${user.name} 的头像`} className="w-16 h-16 rounded-full mr-4" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
