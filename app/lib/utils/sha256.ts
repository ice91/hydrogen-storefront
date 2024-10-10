// app/lib/utils/sha256.ts

import crypto from "crypto";

/**
 * 生成 SHA-256 哈希
 */
export async function sha256(data: string): Promise<string> {
  return crypto.createHash("sha256").update(data).digest("hex");
}
