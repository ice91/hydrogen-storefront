// app/routes/seller/login/callback/updateUser.ts

import { refreshSessionCookie } from "~/lib/server/auth.server";
import { collections } from "~/lib/server/database";
import { ObjectId } from "mongodb";
import { DEFAULT_SETTINGS } from "~/lib/types/Settings";
import { z } from "zod";
import { error } from "@shopify/remix-oxygen";
import crypto from "crypto";
import { sha256 } from "~/lib/utils/sha256";
import { addWeeks } from "date-fns";
import { OIDConfig } from "~/lib/server/auth.server";
import { env } from "$env/dynamic/private";
import { logger } from "~/lib/server/logger";
import type { User } from "~/lib/types/User";
import type { UserinfoResponse } from "openid-client";

interface UpdateUserParams {
  userData: UserinfoResponse;
  locals: any;
  cookies: any;
  userAgent?: string;
  ip?: string;
}

export async function updateUser(params: UpdateUserParams) {
  const { userData, locals, cookies, userAgent, ip } = params;

  const { preferred_username, name, email, picture: avatarUrl, sub: hfUserId, orgs } = z
    .object({
      preferred_username: z.string().optional(),
      name: z.string(),
      picture: z.string().optional(),
      sub: z.string(),
      email: z.string().email().optional(),
      orgs: z
        .array(
          z.object({
            sub: z.string(),
            name: z.string(),
            picture: z.string(),
            preferred_username: z.string(),
            isEnterprise: z.boolean(),
          })
        )
        .optional(),
    })
    .setKey(OIDConfig.NAME_CLAIM, z.string())
    .refine(
      (data) => data.preferred_username || data.email,
      { message: "Either preferred_username or email must be provided by the provider." }
    )
    .transform((data) => ({
      ...data,
      username: data.preferred_username || data.email || data.name,
      name: data[OIDConfig.NAME_CLAIM],
    }))
    .parse(userData);

  const isAdmin = (env.HF_ORG_ADMIN && orgs?.some((org) => org.sub === env.HF_ORG_ADMIN)) || false;
  const isEarlyAccess = (env.HF_ORG_EARLY_ACCESS && orgs?.some((org) => org.sub === env.HF_ORG_EARLY_ACCESS)) || false;

  logger.info(
    {
      login_username: preferred_username || email,
      login_name: name,
      login_email: email,
      login_orgs: orgs?.map((el) => el.sub),
    },
    "user login"
  );

  const existingUser = await collections.users.findOne({ hfUserId });
  let userId = existingUser?._id;

  const previousSessionId = locals.sessionId;
  const secretSessionId = crypto.randomUUID();
  const newSessionId = await sha256(secretSessionId);

  if (await collections.sessions.findOne({ sessionId: newSessionId })) {
    throw error(500, "Session ID collision");
  }

  locals.sessionId = newSessionId;

  let updateFields: Partial<User> = {
    username,
    name,
    avatarUrl,
    isAdmin,
    isEarlyAccess,
    updatedAt: new Date(),
  };

  if (!existingUser) {
    // 创建新用户
    updateFields = {
      ...updateFields,
      email,
      hfUserId,
      points: 0,
      subscriptionStatus: "inactive",
      subscriptionPlan: null,
      subscriptionExpiry: null,
      referralCode: null,
    };

    const { insertedId } = await collections.users.insertOne({
      _id: new ObjectId(),
      createdAt: new Date(),
      ...updateFields,
    });

    userId = insertedId;

    // 创建新会话
    await collections.sessions.insertOne({
      _id: new ObjectId(),
      sessionId: newSessionId,
      userId: insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent,
      ip,
      expiresAt: addWeeks(new Date(), 2),
    });

    // 创建默认设置
    await collections.settings.insertOne({
      userId: insertedId,
      ethicsModalAcceptedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
      ...DEFAULT_SETTINGS,
    });
  } else {
    // 更新现有用户
    updateFields = {
      ...updateFields,
      points: existingUser.points,
      subscriptionStatus: existingUser.subscriptionStatus,
      subscriptionPlan: existingUser.subscriptionPlan,
      subscriptionExpiry: existingUser.subscriptionExpiry,
    };

    const updateOperation: { $set: Partial<User> } = { $set: updateFields };

    if (existingUser.stripeCustomerId) {
      updateOperation.$set.stripeCustomerId = existingUser.stripeCustomerId;
    }

    await collections.users.updateOne({ _id: existingUser._id }, updateOperation);

    // 删除之前的会话，插入新会话
    await collections.sessions.deleteOne({ sessionId: previousSessionId });
    await collections.sessions.insertOne({
      _id: new ObjectId(),
      sessionId: newSessionId,
      userId: existingUser._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent,
      ip,
      expiresAt: addWeeks(new Date(), 2),
    });

    // 迁移对话
    await collections.conversations.updateMany(
      { sessionId: previousSessionId },
      { $set: { userId }, $unset: { sessionId: "" } }
    );
  }

  // 刷新会话 cookie
  refreshSessionCookie(cookies, secretSessionId);
}