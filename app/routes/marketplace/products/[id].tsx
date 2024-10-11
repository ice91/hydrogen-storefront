// app/routes/marketplace/products/[id].tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';
import { ProductForm } from '~/components/Marketplace/ProductForm';
import apiClient from '~/lib/apiClient';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<{
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: 'draft' | 'published' | 'sold' | 'deleted';
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await apiClient.get(`/marketplace/products/${id}`);
        if (response.status === 200) {
          setInitialData(response.data.data);
        } else {
          alert('获取产品信息失败');
          navigate('/marketplace');
        }
      } catch (error: any) {
        console.error('获取产品信息时发生错误:', error);
        alert('获取产品信息时发生错误');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: 'draft' | 'published' | 'sold' | 'deleted';
  }) => {
    try {
      const response = await apiClient.put(`/marketplace/products/${id}`, data);
      if (response.status === 200) {
        navigate('/marketplace');
      } else {
        // 处理错误
        alert('更新产品失败');
      }
    } catch (error: any) {
      console.error('更新产品时发生错误:', error);
      alert('更新产品时发生错误');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto p-4">
          <p>加载中...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">编辑产品</h1>
        {initialData ? (
          <ProductForm initialData={initialData} onSubmit={handleSubmit} />
        ) : (
          <p>未找到产品信息</p>
        )}
      </div>
    </PageLayout>
  );
}
