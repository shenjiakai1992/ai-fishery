// app/api/auth/login/route.ts — 验证码登录（POST）
// 校验验证码 → （未存在则建用户）→ 签发 JWT → 写 HttpOnly Cookie
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signToken, createSessionCookie } from "@/lib/auth";
import { getAdminPhones } from "@/lib/env";
import type { UserStatus } from "@prisma/client";

export async function POST(req: Request) {
  let body: { phone?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const phone = (body?.phone ?? "").trim();
  const code = (body?.code ?? "").trim();
  if (!/^1\d{10}$/.test(phone) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "手机号或验证码格式不正确" }, { status: 400 });
  }
  if (!getAdminPhones().has(phone)) {
    return NextResponse.json({ error: "该手机号无登录权限" }, { status: 403 });
  }

  // 取最近一条验证码，核对哈希与有效期
  const record = await prisma.verificationCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "验证码已过期，请重新获取" }, { status: 400 });
  }

  const hash = crypto.createHash("sha256").update(code).digest("hex");
  if (record.code !== hash) {
    // 尝试次数 +1，超限锁定 15 分钟
    const attempts = record.attempts + 1;
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: {
        attempts,
        lockedUntil: attempts >= 3 ? new Date(Date.now() + 15 * 60_000) : undefined,
      },
    });
    if (attempts >= 3) {
      return NextResponse.json({ error: "尝试次数过多，已锁定 15 分钟" }, { status: 403 });
    }
    return NextResponse.json({ error: "验证码不正确" }, { status: 400 });
  }

  // 校验通过：找或建用户
  const user = await prisma.user.upsert({
    where: { phone },
    update: { status: "ACTIVE" as UserStatus },
    create: { phone, name: phone },
  });
  if (user.status !== "ACTIVE") {
    return NextResponse.json({ error: "该账号已被禁用" }, { status: 403 });
  }

  const token = signToken({ sub: user.id, phone, role: user.role });

  // 记登录审计
  await prisma.auditLog.create({ data: { userId: user.id, action: "login" } });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", createSessionCookie(token));
  return res;
}