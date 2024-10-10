// app/routes/seller.tsx

import { Outlet, redirect } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { requireSeller } from "~/lib/server/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireSeller(request, context);
  return { user };
}

export default function SellerRoutes() {
  return <Outlet />;
}