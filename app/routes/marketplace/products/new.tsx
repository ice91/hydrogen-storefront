// app/routes/marketplace/products/new.tsx

import React from 'react';
import { useNavigate } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import { ProductForm } from '~/components/Marketplace/ProductForm';
import apiClient from '~/lib/apiClient';

export default function NewProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: 'draft' | 'published' | 'sold' | 'deleted';
  }) => {
    try {
      const response = await apiClient.post('/marketplace/products', data);
      if (response.status === 201) {
        navigate('/marketplace');
      } else {
        // 处理错误
        alert('创建产品失败');
      }
    } catch (error: any) {
      console.error('创建产品时发生错误:', error);
      alert('创建产品时发生错误');
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">创建新产品</h1>
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </PageLayout>
  );
}
