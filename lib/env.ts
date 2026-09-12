// lib/env.ts — 服务端环境变量（zod 校验）
// 仅服务端使用（部分敏感变量不能出现在客户端 bundle）。
// 校验失败会抛错，便于启动时及早发现缺配置。
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1).default("dev-secret"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  // 管理员白名单手机号（防短信轰炸）：逗号分隔
  ADMIN_WHITELIST_PHONES: z.string().default(""),
  ALIYUN_ACCESS_KEY_ID: z.string().default(""),
  ALIYUN_ACCESS_KEY_SECRET: z.string().default(""),
  ALIYUN_SMS_SIGN_NAME: z.string().default(""),
  ALIYUN_SMS_TEMPLATE_CODE: z.string().default(""),
  // 文件存储：local（开发）| oss（生产）
  STORAGE_PROVIDER: z.enum(["local", "oss"]).default("local"),
  ALIYUN_OSS_REGION: z.string().default(""),
  ALIYUN_OSS_BUCKET: z.string().default(""),
  ALIYUN_OSS_ACCESS_KEY_ID: z.string().default(""),
  ALIYUN_OSS_ACCESS_KEY_SECRET: z.string().default(""),
});

// 简单缓存避免每次调用重复解析
let parsed: z.infer<typeof serverEnvSchema> | null = null;

export function getEnv() {
  if (parsed) return parsed;
  parsed = serverEnvSchema.parse(process.env);
  return parsed;
}

/** 管理员白名单手机号集合（用于发送/校验短信门槛） */
export function getAdminPhones(): Set<string> {
  return new Set(
    getEnv()
      .ADMIN_WHITELIST_PHONES.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/** 当前存储后端是否为 OSS */
export function isOss(): boolean {
  return getEnv().STORAGE_PROVIDER === "oss";
}