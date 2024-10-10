// app/routes/seller/login.tsx

import { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { initiateLogin } from "~/lib/server/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  return initiateLogin(request, context);
}

export default function Login() {
  return null; // 此路由会立即重定向，无需渲染内容
}