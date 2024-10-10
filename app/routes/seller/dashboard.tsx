// app/routes/seller/dashboard.tsx

import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { PageLayout } from "~/components/PageLayout";
import { SellerInfo } from "~/components/SellerInfo";
import { SellerProductManager } from "~/components/SellerProductManager";
import { requireSeller } from "~/lib/server/auth.server";
import { seoPayload } from "~/lib/seo.server";

const SHOP_SELLER_PRODUCTS_QUERY = `
  query SellerProducts($sellerId: ID!) {
    seller(id: $sellerId) {
      id
      name
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            price
            availableForSale
          }
        }
      }
    }
  }
`;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireSeller(request, context);

  // 获取卖家的产品数据
  const productsData = await context.storefront.query(SHOP_SELLER_PRODUCTS_QUERY, {
    variables: { sellerId: user._id.toString() },
  });

  const products = productsData?.seller?.products?.edges || [];

  const seo = seoPayload.page({ title: "卖家仪表盘", url: request.url });

  return { seo, user, products };
}

export const meta = ({ data }: { data: any }) => {
  return {
    title: "卖家仪表盘",
    description: "管理您的产品和查看销售数据",
  };
};

export default function SellerDashboard() {
  const { user, products } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">卖家仪表盘</h1>
        <SellerInfo user={user} />
        <SellerProductManager products={products} />
      </div>
    </PageLayout>
  );
}