// app/api/auth/sms-send/route.ts — 发送登录验证码（POST）
// 规则（技术选型 Q）：60s 冷却 + 3 次锁定 15 分钟 + 白名单手机号门槛（防短信轰炸）
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getAdminPhones } from "@/lib/env";
import { sendSmsCode } from "@/lib/sms";

const COOL_DOWN_MS = 60_000;

export async function POST(req: Request) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const phone = (body?.phone ?? "").trim();
  if (!/^1\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
  }

  // 白名单门槛：仅白名单手机号可登录后台
  if (!getAdminPhones().has(phone)) {
    return NextResponse.json({ error: "该手机号无登录权限" }, { status: 403 });
  }

  // 查找最近一条验证码记录做冷却/锁定判断
  const last = await prisma.verificationCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  const now = Date.now();
  if (last) {
    if (last.lockedUntil && last.lockedUntil.getTime() > now) {
      const left = Math.ceil((last.lockedUntil.getTime() - now) / 1000);
      return NextResponse.json({ error: `尝试次数过多，请 ${left}s 后再试` }, { status: 429 });
    }
    if (now - last.createdAt.getTime() < COOL_DOWN_MS) {
      const left = Math.ceil(COOL_DOWN_MS - (now - last.createdAt.getTime())) / 1000;
      return NextResponse.json({ error: `发送过于频繁，请 ${Math.ceil(left)}s 后再试` }, { status: 429 });
    }
  }

  const code = crypto.randomInt(100000, 1000000).toString();

  try {
    await prisma.verificationCode.create({
      data: {
        phone,
        code: crypto.createHash("sha256").update(code).digest("hex"), // 落库存哈希
        expiresAt: new Date(now + 5 * 60_000),
      },
    });
    const sent = await sendSmsCode(phone, code);
    return NextResponse.json({ ok: true, mockCode: sent.mockCode });
  } catch {
    return NextResponse.json({ error: "验证码发送失败" }, { status: 500 });
  }
}