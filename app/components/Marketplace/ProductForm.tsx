// app/components/Marketplace/ProductForm.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import apiClient from '~/lib/apiClient';
import { Product, Variant } from '~/lib/type';
import { useNavigate } from 'react-router-dom';
import { useSellerAuth } from './SellerAuthProvider';

interface Props {
  product?: Product;
}

const ProductForm: React.FC<Props> = ({ product }) => {
  const { user } = useSellerAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>(product?.title || '');
  const [description, setDescription] = useState<string>(product?.description || '');
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [templateId, setTemplateId] = useState<string>(product?.providerProductId || '');
  const [variants, setVariants] = useState<Variant[]>(product?.variants || []);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [status, setStatus] = useState<'draft' | 'published'>(product?.status || 'draft');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      title,
      description,
      price,
      templateId,
      variants,
      images,
      tags,
      status,
    };

    try {
      if (product) {
        // 更新产品
        await apiClient.put(`/products/${product._id}`, productData);
        alert('产品更新成功');
      } else {
        // 创建产品
        await apiClient.post('/products', productData);
        alert('产品创建成功');
      }
      navigate('/seller/products');
    } catch (err) {
      console.error('提交产品时出错：', err);
      setError('提交产品时出错。请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  // 添加一个新的变体
  const addVariant = () => {
    setVariants([...variants, { title: '', options: {} }]);
  };

  // 更新变体
  const updateVariant = (index: number, updatedVariant: Variant) => {
    const newVariants = [...variants];
    newVariants[index] = updatedVariant;
    setVariants(newVariants);
  };

  // 删除变体
  const deleteVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{product ? '编辑产品' : '创建新产品'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 标题 */}
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

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium">描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* 价格 */}
        <div>
          <label className="block text-sm font-medium">价格</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
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

        {/* 状态 */}
        <div>
          <label className="block text-sm font-medium">状态</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>

        {/* 变体 */}
        <div>
          <label className="block text-sm font-medium">变体</label>
          {variants.map((variant, index) => (
            <div key={index} className="border border-gray-300 rounded-md p-2 mb-2">
              <div className="flex justify-between items-center">
                <span>变体 {index + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteVariant(index)}
                  className="text-red-500"
                >
                  删除
                </button>
              </div>
              <div className="mt-2">
                <label className="block text-sm">标题</label>
                <input
                  type="text"
                  value={variant.title}
                  onChange={(e) =>
                    updateVariant(index, { ...variant, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* 示例：选项，如颜色和尺寸 */}
              <div className="mt-2">
                <label className="block text-sm">颜色</label>
                <input
                  type="text"
                  value={variant.options['Color'] || ''}
                  onChange={(e) =>
                    updateVariant(index, {
                      ...variant,
                      options: { ...variant.options, Color: e.target.value },
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm">尺寸</label>
                <input
                  type="text"
                  value={variant.options['Size'] || ''}
                  onChange={(e) =>
                    updateVariant(index, {
                      ...variant,
                      options: { ...variant.options, Size: e.target.value },
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            添加变体
          </button>
        </div>

        {/* 图片上传 */}
        <div>
          <label className="block text-sm font-medium">图片 URLs</label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center mt-1">
              <input
                type="text"
                value={image}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = e.target.value;
                  setImages(newImages);
                }}
                className="flex-grow border border-gray-300 rounded-md p-2"
              />
              <button
                type="button"
                onClick={() => {
                  const newImages = images.filter((_, i) => i !== index);
                  setImages(newImages);
                }}
                className="ml-2 text-red-500"
              >
                删除
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setImages([...images, ''])}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            添加图片
          </button>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium">标签</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="用逗号分隔标签"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* 提交按钮 */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            {loading ? '提交中...' : '提交'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
