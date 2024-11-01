/// app/components/Marketplace/ProductForm.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from '@remix-run/react';
import { ClientOnly } from '~/components/ClientOnly';
import { RichTextEditor } from '~/components/RichTextEditor';
import { Product } from '~/lib/types/Product'; // 确保有正确定义 Product 类型
import apiClient from '~/lib/apiClient'; // 导入已配置的 axios 实例

type ProductFormProps = {
  product?: Product; // 如果是编辑，则传入 product
};

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();

  // 表单状态
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [templateId, setTemplateId] = useState(product?.templateId || '');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categories.map(cat => cat.toString()) || []);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 处理图片预览
  useEffect(() => {
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }

    const newImagePreviews = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(newImagePreviews);

    // 清除 URL 对象以释放内存
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 构建 FormData 对象
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('templateId', templateId);
      formData.append('tags', JSON.stringify(tags));
      formData.append('categoryIds', JSON.stringify(categoryIds));

      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      // 使用 apiClient 发送 POST 或 PUT 请求
      const url = product ? `/products/${product.id}` : '/products';
      const method = product ? 'put' : 'post';

      const response = await apiClient({
        method,
        url,
        data: formData,
        // 在使用 FormData 时，不需要手动设置 'Content-Type'
        // axios 会自动设置为 'multipart/form-data' 并处理边界
        withCredentials: true, // 确保携带 Cookie
      });

      // 检查响应状态
      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response.data.error || '提交失败');
      }

      // 重定向到产品列表或产品详情页
      navigate(product ? `/products/${product.id}` : '/seller/products');
    } catch (err: any) {
      // 处理错误，确保从响应中提取错误信息
      setError(err.response?.data?.error || err.message || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理图片选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {product ? '编辑产品' : '创建新产品'}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本资讯 */}
        <div>
          <h3 className="text-lg font-medium mb-2">基本资讯</h3>
          <div className="space-y-4">
            {/* 产品名称 */}
            <div>
              <label className="block text-sm font-medium">名称</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/* 价格 */}
            <div>
              <label className="block text-sm font-medium">价格</label>
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
            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium">标签</label>
              <input
                type="text"
                value={tags.join(', ')}
                onChange={(e) =>
                  setTags(e.target.value.split(',').map((tag) => tag.trim()))
                }
                placeholder="用逗号分隔标签"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/* 类别 ID */}
            <div>
              <label className="block text-sm font-medium">类别 ID</label>
              <input
                type="text"
                value={categoryIds.join(', ')}
                onChange={(e) =>
                  setCategoryIds(e.target.value.split(',').map((id) => id.trim()))
                }
                placeholder="用逗号分隔类别 ID"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
        {/* 图片上传 */}
        <div>
          <h3 className="text-lg font-medium mb-2">图片</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* 图片预览 */}
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={src}
                  alt={`预览 ${index}`}
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
        {/* 提交按钮 */}
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
