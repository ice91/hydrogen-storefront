// app/routes/api/auth/user.tsx

import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { findUser } from "~/lib/server/auth.server";
import type { User } from "~/lib/types/User";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionId = context.cookies.get("sessionId");
  if (!sessionId) {
    return json({ user: null });
  }

  const user = await findUser(sessionId);
  if (!user) {
    return json({ user: null });
  }

  return json({
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      roles: user.roles || [],
      avatarUrl: user.avatarUrl,
      storefrontUrl: user.storefrontUrl,
      earnings: user.earnings,
    },
  });
}

export default function User() {
  return null; // 该路由仅用于 API，无需渲染内容
}