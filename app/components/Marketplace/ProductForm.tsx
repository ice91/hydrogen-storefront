// app/components/Marketplace/ProductForm.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from '@remix-run/react';
import { ClientOnly } from '~/components/ClientOnly';
import { RichTextEditor } from '~/components/RichTextEditor';
import { Product } from '~/lib/types/Product'; // 確保有正確定義 Product 類型
import apiClient from '~/lib/apiClient'; // 導入已配置的 axios 實例

type ImageType = {
  id: string; // 唯一標識符，可以是 URL 或生成的 ID
  url?: string; // 已有圖片的 URL
  file?: File; // 新上傳的圖片檔案
};

type ProductFormProps = {
  product?: Product; // 如果是編輯，則傳入 product
};

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();

  // 表單狀態
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [templateId, setTemplateId] = useState(product?.templateId || '');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categories?.map(cat => cat.toString()) || []);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化圖片狀態
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      const existingImages = product.images.map((url) => ({ id: url, url }));
      setImages(existingImages);
    }
  }, [product]);

  // 處理表單提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 構建 FormData 對象
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('templateId', templateId);
      formData.append('tags', JSON.stringify(tags));
      formData.append('categoryIds', JSON.stringify(categoryIds));

      // 處理已有圖片和新上傳的圖片
      const existingImageUrls = images.filter((img) => img.url).map((img) => img.url);
      formData.append('existingImages', JSON.stringify(existingImageUrls));

      images.filter((img) => img.file).forEach((img, index) => {
        formData.append(`images[${index}]`, img.file!);
      });

      // 使用 apiClient 發送 POST 或 PUT 請求
      const url = product ? `/products/${product._id}` : '/products';
      const method = product ? 'put' : 'post';

      const response = await apiClient({
        method,
        url,
        data: formData,
        // 在使用 FormData 時，不需要手動設置 'Content-Type'
        // axios 會自動設置為 'multipart/form-data' 並處理邊界
        withCredentials: true, // 確保攜帶 Cookie
      });

      // 檢查響應狀態
      if (response.status !== 202 && response.status !== 200) {
        throw new Error(response.data.error || '提交失敗');
      }

      // 提示用戶
      alert(product ? '產品更新成功。' : '產品創建請求已提交，正在處理中。請稍後刷新查看產品狀態。');

      // 重定向到產品列表或產品詳情頁
      navigate('/seller/dashboard');
    } catch (err: any) {
      // 處理錯誤，確保從響應中提取錯誤信息
      const errorMessage = err.response?.data?.error || err.message || '提交失敗';
      setError(errorMessage);

      // 提示用戶
      alert(`錯誤：${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 處理圖片選擇
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const newImages = selectedFiles.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // 處理圖片預覽和刪除
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
            {/* 類別 ID */}
            <div>
              <label className="block text-sm font-medium">類別 ID</label>
              <input
                type="text"
                value={categoryIds.join(', ')}
                onChange={(e) =>
                  setCategoryIds(e.target.value.split(',').map((id) => id.trim()))
                }
                placeholder="用逗號分隔類別 ID"
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
            {images.map((image, index) => (
              <div key={image.id} className="relative w-24 h-24">
                <img
                  src={image.url || URL.createObjectURL(image.file!)}
                  alt={`預覽 ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
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
