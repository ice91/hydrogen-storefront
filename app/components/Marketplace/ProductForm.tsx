// app/components/Marketplace/ProductForm.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from '@remix-run/react';
import { ClientOnly } from 'remix-utils'; // 修改導入路徑
//import { ClientOnly } from '@shopify/hydrogen';
import { Product } from '~/lib/type'; // 確保你有正確定義 Product 類型

type ProductFormProps = {
  product?: Product; // 如果是編輯，則傳入 product
};

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();

  // 表單狀態
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 處理圖片預覽
  useEffect(() => {
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }

    const newImagePreviews = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(newImagePreviews);

    // 清除 URL 對象以釋放內存
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // 處理表單提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));

      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await fetch(
        product ? `/api/products/${product.id}` : '/api/products',
        {
          method: product ? 'PUT' : 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '提交失敗');
      }

      // 重定向到產品列表或產品詳情頁
      navigate(product ? `/products/${product.id}` : '/products');
    } catch (err: any) {
      setError(err.message || '提交失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理圖片選擇
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium">描述</label>
              <ClientOnly fallback={<textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />}>
                {() => {
                  const ReactQuill = require('react-quill');
                  require('react-quill/dist/quill.snow.css');
                  return (
                    <ReactQuill
                      value={description}
                      onChange={setDescription}
                      className="mt-1"
                      theme="snow"
                    />
                  );
                }}
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
        {/* 圖片上傳 */}
        <div>
          <h3 className="text-lg font-medium mb-2">圖片</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* 圖片預覽 */}
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={src}
                  alt={`預覽 ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newPreviews = imagePreviews.filter((_, i) => i !== index);
                    setImagePreviews(newPreviews);
                    const newImages = images.filter((_, i) => i !== index);
                    setImages(newImages);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
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
