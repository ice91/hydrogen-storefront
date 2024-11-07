import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from '@remix-run/react';
import { ClientOnly } from '~/components/ClientOnly';
import { RichTextEditor } from '~/components/RichTextEditor';
import type { Product } from '~/lib/types/Product';
import type { ProductTemplate } from '~/lib/types/ProductTemplate';
import apiClient from '~/lib/apiClient';

type ImageType = {
  id: string; // 唯一標識符，可以是 URL 或生成的 ID
  url?: string; // 已有圖片的 URL
  file?: File; // 新上傳的圖片檔案
  placeholderName: string; // 圖片對應的佔位符名稱
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
  const [categoryIds, setCategoryIds] = useState<string[]>(
    product?.categories?.map((cat) => cat.toString()) || []
  );
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 新增狀態：模板列表
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);

  // 新增狀態：選中的模板詳細信息
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | null>(null);

  // 初始化圖片狀態
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      const existingImages: ImageType[] = product.images.map((url, index) => ({
        id: url,
        url,
        file: undefined,
        placeholderName: `existing_${index}`, // 為現有圖片生成唯一的佔位符名稱
      }));
      setImages(existingImages);
    }
  }, [product]);

  // 在創建模式下，獲取模板列表
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await apiClient.get('/templates');
        setTemplates(response.data.templates);
      } catch (err) {
        console.error('獲取模板列表時出錯：', err);
        setError('無法獲取模板列表');
      }
    };
    if (!product) {
      fetchTemplates();
    }
  }, [product]);

  // 當 templateId 改變時，獲取模板詳細信息（僅在創建模式下）
  useEffect(() => {
    const fetchTemplateDetails = async () => {
      if (!templateId) {
        setSelectedTemplate(null);
        return;
      }
      try {
        const response = await apiClient.get(`/templates/${templateId}`);
        setSelectedTemplate(response.data.template);
      } catch (err) {
        console.error('獲取模板詳細信息時出錯：', err);
        setSelectedTemplate(null);
      }
    };
    if (!product) {
      fetchTemplateDetails();
    }
  }, [templateId, product]);

  // 更新表單字段，當 selectedTemplate 改變時
  useEffect(() => {
    if (selectedTemplate && !product) {
      // 更新表單字段，使用 selectedTemplate 中的值
      setTitle(selectedTemplate.title || '');
      setPrice(selectedTemplate.price ? selectedTemplate.price.toString() : '');
      setDescription(selectedTemplate.description || '');
      setTags(selectedTemplate.tags || []);
      setCategoryIds(
        selectedTemplate.categories ? selectedTemplate.categories.map((cat) => cat.toString()) : []
      );
    }
  }, [selectedTemplate, product]);

  // 從模板詳細信息中提取圖片佔位符名稱列表
  const placeholderNames = React.useMemo(() => {
    if (!selectedTemplate) return [];
    const namesSet = new Set<string>();
    selectedTemplate.variants.forEach((variant) => {
      variant.imagePlaceholders.forEach((placeholder) => {
        namesSet.add(placeholder.name);
      });
    });
    return Array.from(namesSet);
  }, [selectedTemplate]);

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
      formData.append('tags', JSON.stringify(tags));
      formData.append('categoryIds', JSON.stringify(categoryIds));

      if (product) {
        // 編輯模式下，處理圖片
        images.forEach((img) => {
          if (img.url && !img.file) {
            // 保留現有圖片
            formData.append('existingImages', img.url);
          } else if (img.file) {
            // 添加新上傳的圖片
            formData.append(`images[${img.placeholderName}]`, img.file);
          }
        });
      } else {
        // 創建模式下，需要包含 templateId 和圖片
        formData.append('templateId', templateId);

        images.forEach((img) => {
          if (img.file) {
            formData.append(`images[${img.placeholderName}]`, img.file);
          }
        });
      }

      // 確定 API 端點和方法
      const url = product ? `/products/${product._id}` : '/products';
      const method = product ? 'put' : 'post';

      // 發送請求
      const response = await apiClient({
        method,
        url,
        data: formData,
        withCredentials: true,
      });

      // 檢查響應狀態
      if (![200, 202].includes(response.status)) {
        throw new Error(response.data.error || '提交失敗');
      }

      // 提示用戶
      if (product) {
        alert('產品更新成功。');
      } else {
        alert('產品創建請求已提交，正在處理中。請稍後刷新查看產品狀態。');
      }

      // 重定向到賣家儀表板
      navigate('/seller/dashboard');
    } catch (err: any) {
      // 提取錯誤信息
      const errorMessage = err.response?.data?.error || err.message || '提交失敗';
      setError(errorMessage);

      // 提示用戶
      alert(`錯誤：${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 處理特定佔位符的圖片選擇
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, placeholderName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newImage: ImageType = {
      id: URL.createObjectURL(file),
      file,
      placeholderName,
    };
    setImages((prevImages) => {
      // 替換已有的佔位符圖片
      const otherImages = prevImages.filter((img) => img.placeholderName !== placeholderName);
      return [...otherImages, newImage];
    });
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
            {/* 模板選擇 */}
            {!product ? (
              <div>
                <label className="block text-sm font-medium">選擇模板</label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">請選擇模板</option>
                  {templates.map((template) => (
                    <option key={template.templateId} value={template.templateId}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium">模板 ID</label>
                <p className="mt-1">{templateId}</p>
              </div>
            )}
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
        {selectedTemplate && placeholderNames.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">圖片上傳</h3>
            {placeholderNames.map((placeholderName) => (
              <div key={placeholderName} className="mb-4">
                <label className="block text-sm font-medium">
                  上傳圖片 - {placeholderName}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, placeholderName)}
                  className="block w-full text-sm text-gray-500 rounded-md border border-gray-300 p-2"
                />
                {/* 圖片預覽 */}
                {images.find((img) => img.placeholderName === placeholderName) && (
                  <div className="mt-2 w-24 h-24">
                    <img
                      src={
                        images.find((img) => img.placeholderName === placeholderName)!.url ||
                        URL.createObjectURL(
                          images.find((img) => img.placeholderName === placeholderName)!.file!
                        )
                      }
                      alt={`預覽 ${placeholderName}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* 編輯模式下顯示已上傳的圖片 */}
        {product && (
          <div>
            <h3 className="text-lg font-medium mb-2">圖片</h3>
            <div className="mt-4 flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="w-24 h-24">
                  <img
                    src={
                      image.file
                        ? URL.createObjectURL(image.file)
                        : image.url || '/placeholder.png'
                    }
                    alt={`圖片 ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {/* 添加圖片刪除按鈕（可選） */}
                  {/* <button
                    onClick={() => handleRemoveImage(image.placeholderName)}
                    className="mt-1 text-red-500 text-xs"
                  >
                    刪除
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        )}
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
