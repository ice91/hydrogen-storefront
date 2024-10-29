import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from '@remix-run/react';
import { ClientOnly } from '~/components/ClientOnly';
import { RichTextEditor } from '~/components/RichTextEditor';
import { Product } from '~/lib/type';

type ProductFormProps = {
  product?: Product;
};

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();

  // 表單狀態
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [templateId, setTemplateId] = useState(product?.templateId || '');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 處理表單提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 構建請求數據對象
      const requestData: any = {
        title,
        price: parseFloat(price),
        description,
        tags,
        templateId,
      };

      // 發送 POST 請求
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交失敗');
      }

      // 重定向到產品列表
      navigate('/seller/products');
    } catch (err: any) {
      setError(err.message || '提交失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {product ? '編輯產品' : '創建新產品'}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本資訊 */}
        <div>
          <h3 className="text-lg font-medium mb-2">基本資訊</h3>
          <div className="space-y-4">
            {/* 產品名稱 */}
            <div>
              <label className="block text-sm font-medium">名稱</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/* 價格 */}
            <div>
              <label className="block text-sm font-medium">價格</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/* 模板 ID */}
            <div>
              <label className="block text-sm font-medium">模板 ID</label>
              <input
                type="text"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium">描述</label>
              <ClientOnly
                fallback={
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                }
              >
                <RichTextEditor value={description} onChange={setDescription} />
              </ClientOnly>
            </div>
            {/* 標籤 */}
            <div>
              <label className="block text-sm font-medium">標籤</label>
              <input
                type="text"
                value={tags.join(', ')}
                onChange={(e) =>
                  setTags(e.target.value.split(',').map((tag) => tag.trim()))
                }
                placeholder="用逗號分隔標籤"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
        {/* 提交按鈕 */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md"
          >
            {loading ? '提交中...' : '提交'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
