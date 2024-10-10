// app/routes/seller/products/new.tsx

import { useLoaderData, redirect } from "@remix-run/react";
import { type LoaderFunctionArgs, ActionFunctionArgs } from "@shopify/remix-oxygen";
import { PageLayout } from "~/components/PageLayout";
import { requireSeller } from "~/lib/server/auth.server";
import { z } from "zod";
import { collections } from "~/lib/server/database";
import { sha256 } from "~/lib/utils/sha256";
import crypto from "crypto";
import { addWeeks } from "date-fns";
import { error } from "@shopify/remix-oxygen";
import { useTransition } from "@remix-run/react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireSeller(request, context);
  return { user };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireSeller(request, context);

  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const price = formData.get("price");
  const images = formData.getAll("images") as string[];

  // 验证表单数据
  const productSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/),
    images: z.array(z.string().url()).nonempty(),
  });

  const parsed = productSchema.safeParse({ title, description, price, images });

  if (!parsed.success) {
    return json({ errors: parsed.error.errors }, { status: 400 });
  }

  const { title: validTitle, description: validDescription, price: validPrice, images: validImages } = parsed.data;

  // 创建产品
  const productId = crypto.randomUUID(); // 生成产品 ID
  const podProductId = crypto.randomUUID(); // 示例 POD 产品 ID
  const shopifyProductId = `shopify_${sha256(productId)}`; // 示例 Shopify 产品 ID

  const newProduct = {
    _id: new context.db.ObjectId(),
    userId: user._id,
    title: validTitle,
    description: validDescription,
    images: validImages,
    price: parseFloat(validPrice),
    shopifyProductId,
    podProductId,
    status: "draft",
    tags: [],
    categoryIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collections.products.insertOne(newProduct);

  // 这里可以调用 Shopify API 和 Gelato API 将产品上架

  return redirect("/seller/dashboard");
}

export default function NewProduct() {
  const { user } = useLoaderData();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">新增产品</h1>
        <form method="post" className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              标题
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              name="description"
              id="description"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              价格
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              图片 URLs
            </label>
            <input
              type="url"
              name="images"
              id="images"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://example.com/image.jpg"
            />
            {/* 可以添加多个图片输入字段 */}
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "提交中..." : "创建产品"}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}