// app/components/Marketplace/ProductForm.tsx

import React, { useState, useEffect } from 'react';

interface ProductFormProps {
  initialData?: {
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: 'draft' | 'published' | 'sold' | 'deleted';
  };
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: 'draft' | 'published' | 'sold' | 'deleted';
  }) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [stock, setStock] = useState<number>(initialData?.stock || 0);
  const [status, setStatus] = useState<'draft' | 'published' | 'sold' | 'deleted'>(initialData?.status || 'draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, price, images, stock, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">价格</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">图片 URLs</label>
        <input
          type="text"
          value={images.join(',')}
          onChange={(e) => setImages(e.target.value.split(','))}
          placeholder="用逗号分隔图片 URLs"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">库存</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">状态</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'sold' | 'deleted')}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="sold">已售出</option>
          <option value="deleted">已删除</option>
        </select>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
        提交
      </button>
    </form>
  );
};
