// app/routes/seller/login/callback.tsx

import { LoaderFunctionArgs, redirect, json } from "@shopify/remix-oxygen";
import { getOIDCUserData, validateAndParseCsrfToken } from "~/lib/server/auth.server";
import { updateUser } from "./login/callback/updateUser";
import { error } from "@shopify/remix-oxygen";
import { z } from "zod";
import { OIDConfig } from "~/lib/server/auth.server";

const allowedUserEmails = z
  .array(z.string().email())
  .optional()
  .default([])
  .parse(JSON.parse(process.env.ALLOWED_USER_EMAILS || "[]"));

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const { error: errorName, error_description: errorDescription } = z
    .object({
      error: z.string().optional(),
      error_description: z.string().optional(),
    })
    .parse(Object.fromEntries(url.searchParams.entries()));

  if (errorName) {
    throw error(400, `${errorName}${errorDescription ? ": " + errorDescription : ""}`);
  }

  const { code, state, iss } = z
    .object({
      code: z.string(),
      state: z.string(),
      iss: z.string().optional(),
    })
    .parse(Object.fromEntries(url.searchParams.entries()));

  const csrfToken = Buffer.from(state, "base64").toString("utf-8");
  const validatedToken = await validateAndParseCsrfToken(csrfToken, context.cookies.get("sessionId") || "");

  if (!validatedToken) {
    throw error(403, "Invalid or expired CSRF token");
  }

  const { userData } = await getOIDCUserData(
    { redirectURI: validatedToken.redirectUrl },
    code,
    iss
  );

  // 过滤允许的用户邮箱
  if (allowedUserEmails.length > 0) {
    if (!userData.email) {
      throw error(403, "User not allowed: email not returned");
    }
    const emailVerified = userData.email_verified ?? true;
    if (!emailVerified) {
      throw error(403, "User not allowed: email not verified");
    }
    if (!allowedUserEmails.includes(userData.email)) {
      throw error(403, "User not allowed");
    }
  }

  await updateUser({
    userData,
    locals: context.locals,
    cookies: context.cookies,
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip: request.headers.get("x-forwarded-for") ?? "unknown",
  });

  return redirect("/seller/dashboard");
}

export default function Callback() {
  return null; // 该路由仅用于处理回调，无需渲染内容
}