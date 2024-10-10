// app/lib/server/auth.ts

import { Issuer, Client, TokenSet, UserinfoResponse } from 'oidc-client-ts';
import { addHours, addWeeks } from 'date-fns';
import { sha256 } from '~/lib/utils/sha256';
import { z } from 'zod';
import { logger } from '~/lib/server/logger';
import { getCollections } from './database'; // Updated import

interface Env {
  OPENID_CLIENT_ID: string;
  OPENID_CLIENT_SECRET: string;
  OPENID_PROVIDER_URL: string;
  OPENID_SCOPES: string;
  OPENID_NAME_CLAIM: string;
  OPENID_TOLERANCE?: string;
  OPENID_RESOURCE: string;
  COOKIE_NAME: string;
  ALLOW_INSECURE_COOKIES: string;
  // Add other env variables as needed
}

/**
 * OIDC 配置接口
 */
export interface OIDCSettings {
  redirectURI: string;
}

/**
 * OIDC 用户信息接口
 */
export interface OIDCUserInfo {
  token: TokenSet;
  userData: UserinfoResponse;
}

/**
 * 解析并验证 OIDC 配置
 */
const stringWithDefault = (value: string) =>
  z.string().default(value).transform((el) => (el ? el : value));

export const getOIDConfig = (env: Env) =>
  z
    .object({
      CLIENT_ID: stringWithDefault(env.OPENID_CLIENT_ID || ''),
      CLIENT_SECRET: stringWithDefault(env.OPENID_CLIENT_SECRET || ''),
      PROVIDER_URL: stringWithDefault(env.OPENID_PROVIDER_URL || ''),
      SCOPES: stringWithDefault(env.OPENID_SCOPES || 'openid profile email'),
      NAME_CLAIM: stringWithDefault(env.OPENID_NAME_CLAIM || 'name'),
      TOLERANCE: z.string().optional(),
      RESOURCE: stringWithDefault(env.OPENID_RESOURCE || ''),
    })
    .parse({
      CLIENT_ID: env.OPENID_CLIENT_ID,
      CLIENT_SECRET: env.OPENID_CLIENT_SECRET,
      PROVIDER_URL: env.OPENID_PROVIDER_URL,
      SCOPES: env.OPENID_SCOPES,
      NAME_CLAIM: env.OPENID_NAME_CLAIM,
      TOLERANCE: env.OPENID_TOLERANCE,
      RESOURCE: env.OPENID_RESOURCE,
    });

export const requiresUser = (env: Env) =>
  !!getOIDConfig(env).CLIENT_ID && !!getOIDConfig(env).CLIENT_SECRET;

/**
 * 生成 CSRF Token
 */
export async function generateCsrfToken(
  env: Env,
  sessionId: string,
  redirectUrl: string
): Promise<string> {
  const data = {
    expiration: addHours(new Date(), 1).getTime(),
    redirectUrl,
  };
  const signature = await sha256(JSON.stringify(data) + '##' + sessionId);
  return Buffer.from(
    JSON.stringify({
      data,
      signature,
    })
  ).toString('base64');
}

/**
 * 验证并解析 CSRF Token
 */
export async function validateAndParseCsrfToken(
  env: Env,
  csrfToken: string,
  sessionId: string
): Promise<{ redirectUrl: string } | null> {
  try {
    const decoded = Buffer.from(csrfToken, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    const { data, signature } = parsed;
    const expectedSignature = await sha256(
      JSON.stringify(data) + '##' + sessionId
    );
    if (signature !== expectedSignature) {
      return null;
    }
    if (data.expiration < Date.now()) {
      return null;
    }
    return { redirectUrl: data.redirectUrl };
  } catch (error) {
    logger.error('Invalid CSRF Token', error);
    return null;
  }
}

/**
 * 查找用户
 */
export async function findUser(env: Env, sessionId: string) {
  const collections = await getCollections({
    MONGODB_URL: process.env.MONGODB_URL!,
    MONGODB_DIRECT_CONNECTION: process.env.MONGODB_DIRECT_CONNECTION!,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME!,
  });

  const session = await collections.sessions.findOne({ sessionId });
  if (!session) {
    return null;
  }
  return await collections.users.findOne({ _id: session.userId });
}

/**
 * 获取 OIDC 客户端
 */
async function getOIDCClient(env: Env, settings: OIDCSettings): Promise<Client> {
  const oidConfig = getOIDConfig(env);

  // Discover the OpenID Connect issuer
  const issuer = await Issuer.discover(oidConfig.PROVIDER_URL);

  // Create a new client instance
  const client = new issuer.Client({
    client_id: oidConfig.CLIENT_ID,
    client_secret: oidConfig.CLIENT_SECRET,
    redirect_uris: [settings.redirectURI],
    response_types: ['code'],
    clock_tolerance: oidConfig.TOLERANCE
      ? parseInt(oidConfig.TOLERANCE, 10)
      : undefined,
  });

  return client;
}

/**
 * 获取 OIDC 授权 URL
 */
export async function getOIDCAuthorizationUrl(
  env: Env,
  settings: OIDCSettings,
  params: { sessionId: string }
): Promise<string> {
  const client = await getOIDCClient(env, settings);
  const csrfToken = await generateCsrfToken(
    env,
    params.sessionId,
    settings.redirectURI
  );

  // Build the authorization URL
  const authorizationUrl = client.authorizationUrl({
    scope: getOIDConfig(env).SCOPES,
    state: csrfToken,
    resource: getOIDConfig(env).RESOURCE || undefined,
  });

  return authorizationUrl;
}

/**
 * 获取 OIDC 用户数据
 */
export async function getOIDCUserData(
  env: Env,
  settings: OIDCSettings,
  code: string,
  state: string,
  iss?: string
): Promise<OIDCUserInfo> {
  const client = await getOIDCClient(env, settings);

  // Handle the callback and get tokens
  const tokenSet = await client.callback(
    settings.redirectURI,
    { code, state },
    { nonce: undefined }
  );

  // Fetch user information
  const userData = await client.userinfo(tokenSet.access_token);

  return { token: tokenSet, userData };
}

/**
 * 刷新会话 Cookie
 */
export function refreshSessionCookie(env: Env, cookies: any, sessionId: string) {
  cookies.set(env.COOKIE_NAME, sessionId, {
    path: '/',
    sameSite:
      process.env.NODE_ENV === 'development' || env.ALLOW_INSECURE_COOKIES === 'true'
        ? 'lax'
        : 'none',
    secure:
      process.env.NODE_ENV !== 'development' &&
      !(env.ALLOW_INSECURE_COOKIES === 'true'),
    httpOnly: true,
    expires: addWeeks(new Date(), 2),
  });
}

/**
 * 身份验证条件
 */
export const authCondition = (locals: any) => {
  return locals.user
    ? { userId: locals.user._id }
    : { sessionId: locals.sessionId, userId: { $exists: false } };
};
